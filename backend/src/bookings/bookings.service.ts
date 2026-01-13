import prisma from "../db";
import { CreateBooking } from "../schemas/bookings.schema";
const midtransClient = require("midtrans-client");
import { Prisma, User } from "@prisma/client";
import { Pagination } from "../schemas/pagination.schema";
import { config } from "../config/env";

export class BookingsService {
    private snap: any;

    constructor(snap: any) {
        this.snap = snap;
    }

    public async findAllBookings(query: Pagination, user: User) {
        const { page = 1, limit = 10, cursor, take, search } = query;
        const skip = (page - 1) * limit;

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

        const paginationArgs: any = {
            take: take ?? Number(limit),
            where: whereCondition,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
                user: true,
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
        const totalPages = Math.ceil(total / (take ?? limit));

        return {
            data: bookings,
            meta: {
                total,
                page: cursor ? undefined : page,
                limit: take ?? limit,
                totalPages,
                nextCursor, // For infinite scroll
            },
        };
    }

    public async findBookingById(bookingId: string) {
        return prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
                user: true,
                review: true,
                payment: true,
            },
        });
    }

    public async createBooking(data: CreateBooking, user: User) {
        const field = await prisma.field.findUnique({
            where: { id: data.fieldId },
        });
        if (!field) throw new Error("Field not found");

        const duration = data.duration || 1;
        // Construct timestamp in WIB (UTC+7)
        const startTime = new Date(
            `${data.bookingDate}T${data.startTime}:00.000+07:00`
        );
        const endTime = new Date(
            startTime.getTime() + duration * 60 * 60 * 1000
        );

        // Check for overlaps: (StartA < EndB) and (EndA > StartB)
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                fieldId: data.fieldId,
                bookingDate: new Date(data.bookingDate),
                status: { in: ["CONFIRMED", "PENDING"] },
                startTime: { lt: endTime },
                endTime: { gt: startTime },
            },
        });

        if (overlappingBooking)
            throw new Error(
                "This time slot (or part of it) is already booked."
            );

        const totalPrice = field.pricePerHour * duration;

        return prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
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

            // Midtrans constraints
            const rawName = `${field.name} @ ${newBooking.field.venue.name}`;
            const safeName =
                rawName.length > 50 ? rawName.substring(0, 50) : rawName;
            const safePrice = Math.round(totalPrice);

            const transactionDetails = {
                transaction_details: {
                    order_id: newBooking.id, // Booking ID is still the Order ID
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
                    finish: `${config.BACKEND_URL}/payments/finish`,
                    unfinish: `${config.BACKEND_URL}/payments/unfinish`,
                    error: `${config.BACKEND_URL}/payments/error`,
                },
            };

            const transactionToken = await this.snap.createTransactionToken(
                transactionDetails
            );

            // Create Payment Record
            await tx.payment.create({
                data: {
                    bookingId: newBooking.id,
                    amount: totalPrice,
                    status: "PENDING",
                    snapToken: transactionToken,
                },
            });

            return { booking: newBooking, snapToken: transactionToken };
        });
    }

    public async updateStatus(
        bookingId: string,
        status: "CONFIRMED" | "CANCELLED" | "PENDING",
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

    public async cancelBooking(bookingId: string) {
        return this.updateStatus(bookingId, "CANCELLED", "FAILED");
    }
}
