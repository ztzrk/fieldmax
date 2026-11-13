import prisma from "../db";
import { CreateBooking } from "../schemas/bookings.schema";
import { Prisma, User } from "@prisma/client";
import { Pagination } from "../schemas/pagination.schema";
import { config } from "../config/env";
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
} from "../utils/errors";

export class BookingsService {
    private snap: any;

    constructor(snap: any) {
        this.snap = snap;
    }

    public async findAllBookings(query: Pagination, user: User) {
        const {
            page = 1,
            limit = 10,
            cursor,
            take,
            search,
            sortBy,
            sortOrder,
        } = query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const takeNum = take ? Number(take) : undefined;
        const skip = (pageNum - 1) * limitNum;

        const whereCondition: Prisma.BookingWhereInput = {
            ...(search && {
                OR: [
                    { id: { contains: search } },
                    { user: { fullName: { contains: search } } },
                    { field: { name: { contains: search } } },
                ],
            }),
        };

        // Role-based filtering
        if (user.role === "USER") {
            whereCondition.userId = user.id;
        } else if (user.role === "RENTER") {
            whereCondition.field = {
                venue: {
                    renterId: user.id,
                },
            };
        }
        // ADMIN sees all (no additional filter)

        const orderByCondition: Prisma.BookingOrderByWithRelationInput =
            sortBy && sortOrder
                ? sortBy === "user"
                    ? { user: { fullName: sortOrder } }
                    : sortBy === "field"
                    ? { field: { name: sortOrder } }
                    : { [sortBy]: sortOrder }
                : { createdAt: "desc" };

        const paginationArgs: any = {
            take: takeNum ?? limitNum,
            where: whereCondition,
            orderBy: orderByCondition,
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true,
                        role: true,
                    },
                },
                review: true,
                payment: true,
            },
        };

        if (cursor) {
            paginationArgs.cursor = { id: cursor };
            paginationArgs.skip = 1; // Skip the cursor itself
        } else {
            paginationArgs.skip = Number(skip);
        }

        const [bookings, total] = await prisma.$transaction([
            prisma.booking.findMany(paginationArgs),
            prisma.booking.count({
                where: whereCondition,
            }),
        ]);

        const nextCursor =
            bookings.length > 0 ? bookings[bookings.length - 1].id : null;
        const totalPages = Math.ceil(total / (takeNum ?? limitNum));

        return {
            data: bookings,
            meta: {
                total,
                page: cursor ? undefined : pageNum,
                limit: takeNum ?? limitNum,
                totalPages,
                nextCursor, // For infinite scroll
            },
        };
    }

    public async findBookingById(bookingId: string, user?: User) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phoneNumber: true,
                        role: true,
                    },
                },
                review: true,
                payment: true,
            },
        });

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (user) {
            if (user.role === "USER" && booking.userId !== user.id) {
                throw new ForbiddenError(
                    "You do not have access to view this booking."
                );
            }
            if (
                user.role === "RENTER" &&
                booking.field.venue.renterId !== user.id
            ) {
                throw new ForbiddenError(
                    "You do not have access to view this booking."
                );
            }
        }

        // Auto-sync status from Midtrans if still pending (especially vital on localhost where webhooks cannot reach directly)
        if (
            booking.status === "PENDING" &&
            booking.payment?.status === "PENDING"
        ) {
            try {
                const statusResponse = await this.snap.transaction.status(
                    bookingId
                );
                if (statusResponse) {
                    const txStatus = statusResponse.transaction_status;
                    const fraudStatus = statusResponse.fraud_status;

                    if (
                        txStatus === "settlement" ||
                        (txStatus === "capture" && fraudStatus === "accept")
                    ) {
                        await this.updateStatus(bookingId, "CONFIRMED", "PAID");
                        booking.status = "CONFIRMED";
                        if (booking.payment) booking.payment.status = "PAID";
                    } else if (txStatus === "cancel" || txStatus === "deny") {
                        await this.updateStatus(bookingId, "CANCELLED", "FAILED");
                        booking.status = "CANCELLED";
                        if (booking.payment) booking.payment.status = "FAILED";
                    } else if (txStatus === "expire") {
                        await this.updateStatus(bookingId, "CANCELLED", "EXPIRED");
                        booking.status = "CANCELLED";
                        if (booking.payment) booking.payment.status = "EXPIRED";
                    }
                }
            } catch (error) {
                // Ignore if transaction is not yet found on Midtrans
            }
        }

        return booking;
    }

    public async createBooking(data: CreateBooking, user: User) {
        const field = await prisma.field.findUnique({
            where: { id: data.fieldId },
            include: { venue: true },
        });
        if (!field) throw new NotFoundError("Field not found");
        if (field.isClosed)
            throw new ValidationError("This field is currently closed.");
        if (field.status !== "APPROVED" || field.venue.status !== "APPROVED") {
            throw new ValidationError(
                "Cannot book an unapproved or inactive field/venue."
            );
        }

        const duration = data.duration || 1;
        if (duration < 1 || duration > 12) {
            throw new ValidationError("Durasi sewa harus antara 1 hingga 12 jam.");
        }

        // 1. Boundary & Date Validation (No bookings in the past)
        const bookingDateOnlyStr = data.bookingDate.split("T")[0];
        const todayStr = new Date(Date.now() + 7 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

        if (bookingDateOnlyStr < todayStr) {
            throw new ValidationError("Tidak dapat memesan tanggal di masa lampau.");
        }

        const startHour = parseInt(data.startTime.split(":")[0], 10);
        const startMinute = parseInt(data.startTime.split(":")[1] || "0", 10);

        if (bookingDateOnlyStr === todayStr) {
            const currentHourMin = new Date(Date.now() + 7 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[1]
                .substring(0, 5);
            const startHourMin = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;

            if (startHourMin <= currentHourMin) {
                throw new ValidationError(
                    "Tidak dapat memesan slot waktu yang sudah terlewat untuk hari ini."
                );
            }
        }

        // 2. Midnight crossover check (Bookings must end on the same calendar day)
        if (startHour + duration > 24) {
            throw new ValidationError(
                "Pemesanan tidak dapat melintasi tengah malam (maksimal pukul 24:00)."
            );
        }

        // 3. Venue Operational Schedule Validation
        const targetBookingDate = new Date(data.bookingDate);
        const dayOfWeek = targetBookingDate.getDay();

        const schedule = await prisma.venueSchedule.findFirst({
            where: {
                venueId: field.venueId,
                dayOfWeek: dayOfWeek,
            },
        });

        if (!schedule) {
            const totalSchedules = await prisma.venueSchedule.count({
                where: { venueId: field.venueId },
            });
            if (totalSchedules > 0) {
                throw new ValidationError("Venue tutup pada hari ini.");
            }
        } else {
            const openH = schedule.openTime.getUTCHours();
            const openM = schedule.openTime.getUTCMinutes();
            const closeH = schedule.closeTime.getUTCHours();
            const closeM = schedule.closeTime.getUTCMinutes();

            const openMinutes = openH * 60 + openM;
            const closeMinutes = closeH * 60 + closeM;

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = startMinutes + duration * 60;

            if (startMinutes < openMinutes || endMinutes > closeMinutes) {
                const formatHM = (h: number, m: number) =>
                    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
                throw new ValidationError(
                    `Waktu sewa di luar jam operasional venue (${formatHM(openH, openM)} - ${formatHM(closeH, closeM)}).`
                );
            }
        }

        // Parse start time as UTC epoch for Postgres @db.Time(6)
        const timePart =
            data.startTime.length === 5
                ? `${data.startTime}:00`
                : data.startTime;
        const startTime = new Date(`1970-01-01T${timePart}.000Z`);
        const endTime = new Date(
            startTime.getTime() + duration * 60 * 60 * 1000
        );

        const totalPrice = field.pricePerHour * duration;

        // 4. Create booking inside a lean, Serializable transaction to guarantee no double-booking
        let newBooking;
        try {
            newBooking = await prisma.$transaction(
                async (tx) => {
                    // Overlap check inside transaction
                    const overlappingBooking = await tx.booking.findFirst({
                        where: {
                            fieldId: data.fieldId,
                            bookingDate: new Date(data.bookingDate),
                            status: { in: ["CONFIRMED", "PENDING"] },
                            startTime: { lt: endTime },
                            endTime: { gt: startTime },
                        },
                    });

                    if (overlappingBooking) {
                        throw new ConflictError(
                            "This time slot (or part of it) is already booked."
                        );
                    }

                    return tx.booking.create({
                        data: {
                            userId: user.id,
                            fieldId: data.fieldId,
                            bookingDate: new Date(data.bookingDate),
                            startTime: startTime,
                            endTime: endTime,
                            totalPrice: totalPrice,
                            status: "PENDING",
                        },
                        include: {
                            field: {
                                include: {
                                    venue: true,
                                },
                            },
                        },
                    });
                },
                {
                    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
                    maxWait: 5000,
                    timeout: 10000,
                }
            );
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2034"
            ) {
                throw new ConflictError(
                    "This time slot was just booked by another user. Please choose another time."
                );
            }
            throw error;
        }

        // 2. Call Midtrans Snap API OUTSIDE the database transaction
        // This prevents connection pool exhaustion when external network requests take time
        let transactionToken: string;
        try {
            const rawName = `${field.name} @ ${newBooking.field.venue.name}`;
            const safeName =
                rawName.length > 50 ? rawName.substring(0, 50) : rawName;
            const safePrice = Math.round(totalPrice);

            const transactionDetails = {
                transaction_details: {
                    order_id: newBooking.id,
                    gross_amount: safePrice,
                },
                customer_details: {
                    first_name: user.fullName,
                    email: user.email,
                },
                item_details: [
                    {
                        id: field.id,
                        price: safePrice,
                        quantity: 1,
                        name: safeName,
                    },
                ],
                callbacks: {
                    finish: `${config.FRONTEND_URL}/bookings`,
                    unfinish: `${config.FRONTEND_URL}/bookings`,
                    error: `${config.FRONTEND_URL}/bookings`,
                },
            };

            transactionToken = await this.snap.createTransactionToken(
                transactionDetails
            );
        } catch (error: any) {
            // If Midtrans call fails, cancel the pending booking so the slot is freed up immediately
            await prisma.booking.update({
                where: { id: newBooking.id },
                data: { status: "CANCELLED" },
            });
            throw new ValidationError(
                "Failed to generate payment gateway token. Please try again."
            );
        }

        // 3. Create Payment Record linked to the new booking
        await prisma.payment.create({
            data: {
                bookingId: newBooking.id,
                amount: totalPrice,
                status: "PENDING",
                snapToken: transactionToken,
            },
        });

        return { booking: newBooking, snapToken: transactionToken };
    }

    public async updateStatus(
        bookingId: string,
        status: "CONFIRMED" | "CANCELLED" | "PENDING" | "COMPLETED",
        paymentStatus?: "PENDING" | "PAID" | "EXPIRED" | "FAILED"
    ) {
        return prisma.$transaction(async (tx) => {
            const booking = await tx.booking.update({
                where: { id: bookingId },
                data: { status },
            });

            if (paymentStatus) {
                await tx.payment.update({
                    where: { bookingId },
                    data: { status: paymentStatus },
                });
            }

            return booking;
        });
    }

    public async confirmBooking(bookingId: string) {
        return this.updateStatus(bookingId, "CONFIRMED", "PAID");
    }

    public async cancelBooking(bookingId: string, user?: User) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                field: {
                    include: { venue: true },
                },
            },
        });

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (user) {
            if (user.role === "USER" && booking.userId !== user.id) {
                throw new ForbiddenError(
                    "You do not have permission to cancel this booking."
                );
            }
            if (
                user.role === "RENTER" &&
                booking.field.venue.renterId !== user.id
            ) {
                throw new ForbiddenError(
                    "You do not have permission to cancel this booking."
                );
            }
        }

        return this.updateStatus(bookingId, "CANCELLED", "FAILED");
    }
}
