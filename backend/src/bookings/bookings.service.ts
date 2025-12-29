import prisma from "../db";
import { CreateBookingDto } from "./dtos/create-booking.dto";
import midtransclient from "midtrans-client";
import { Prisma, User } from "@prisma/client";
import { PaginationDto } from "../dtos/pagination.dto";

export class BookingsService {
    private snap = new midtransclient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    public async findAllBookings(query: PaginationDto, user: User) {
        const { page = 1, limit = 10, search } = query;
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

        const [bookings, total] = await prisma.$transaction([
            prisma.booking.findMany({
                skip: Number(skip),
                take: Number(limit),
                where: whereCondition,
                include: {
                    field: {
                        include: {
                            venue: true,
                        },
                    },
                    user: true, // Include user details for Admin/Renter views
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.booking.count({
                where: whereCondition,
            }),
        ]);
        const totalPages = Math.ceil(total / limit);

        return { data: bookings, meta: { total, page, limit, totalPages } };
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
            },
        });
    }

    public async createBooking(data: CreateBookingDto, user: User) {
        const field = await prisma.field.findUnique({
            where: { id: data.fieldId },
        });
        if (!field) throw new Error("Field not found");

        const duration = data.duration || 1;
        // Construct timestamp in WIB (UTC+7)
        const startTime = new Date(
            `${data.bookingDate}T${data.startTime}:00.000+07:00`
        );
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

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
            throw new Error("This time slot (or part of it) is already booked.");

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

            const transactionDetails = {
                transaction_details: {
                    order_id: newBooking.id,
                    gross_amount: totalPrice,
                },
                customer_details: {
                    first_name: user.fullName,
                    email: user.email,
                },
                item_details: [
                    {
                        id: field.id,
                        price: totalPrice,
                        quantity: 1,
                        name: `${field.name} @ ${newBooking.field.venue.name}`,
                    },
                ],
                callbacks: {
                    finish: `${process.env.BACKEND_URL || "http://localhost:3000"}/payments/finish`,
                    unfinish: `${process.env.BACKEND_URL || "http://localhost:3000"}/payments/unfinish`,
                    error: `${process.env.BACKEND_URL || "http://localhost:3000"}/payments/error`,
                },
            };

            const transactionToken = await this.snap.createTransactionToken(
                transactionDetails
            );

            await tx.booking.update({
                where: { id: newBooking.id },
                data: { snapToken: transactionToken },
            });

            return { booking: newBooking, snapToken: transactionToken };
        });
    }

    public async updateStatus(
        bookingId: string,
        status: "CONFIRMED" | "CANCELLED" | "PENDING",
        paymentStatus?: "PENDING" | "PAID" | "EXPIRED" | "FAILED"
    ) {
        return prisma.booking.update({
            where: { id: bookingId },
            data: { 
                status,
                ...(paymentStatus && { paymentStatus }),
            },
        });
    }

    public async confirmBooking(bookingId: string) {
        return this.updateStatus(bookingId, "CONFIRMED", "PAID");
    }

    public async cancelBooking(bookingId: string) {
        return this.updateStatus(bookingId, "CANCELLED", "FAILED");
    }
}
