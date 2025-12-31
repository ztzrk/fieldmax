import prisma from "../db";
import { CreateReviewDto } from "./dtos/create-review.dto";
import { PaginationDto, ReviewFilterDto } from "../dtos/pagination.dto";

export class ReviewsService {
    public async create(userId: string, data: CreateReviewDto) {
        // 1. Verify booking exists and belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id: data.bookingId },
            include: { review: true },
        });

        if (!booking) {
            throw new Error("Booking not found");
        }

        if (booking.userId !== userId) {
            throw new Error("Unauthorized to review this booking");
        }

        // 2. Verify booking is completed (or confirmed and past time)
        // For simplicity, we check if status is COMPLETED or (CONFIRMED and endTime < now)
        const isCompleted = booking.status === "COMPLETED";
        const isPastAndConfirmed =
            booking.status === "CONFIRMED" &&
            new Date() > new Date(booking.endTime);

        if (!isCompleted && !isPastAndConfirmed) {
            throw new Error("Cannot review an incomplete booking");
        }

        // 3. Check if review already exists
        if (booking.review) {
            throw new Error("Booking already reviewed");
        }

        // 4. Create review
        return prisma.review.create({
            data: {
                rating: data.rating,
                comment: data.comment,
                userId: userId,
                fieldId: booking.fieldId,
                bookingId: data.bookingId,
            },
        });
    }

    public async getByFieldId(fieldId: string, query: ReviewFilterDto) {
        const { page = 1, limit = 10, ratings } = query;
        const skip = (page - 1) * limit;

        const where: any = { fieldId };
        if (ratings && ratings.length > 0) {
            where.rating = { in: ratings };
        }

        const [reviews, total] = await prisma.$transaction([
            prisma.review.findMany({
                where,
                include: {
                    user: {
                        select: {
                            fullName: true,
                            profile: {
                                select: {
                                    profilePictureUrl: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: Number(skip),
                take: Number(limit),
            }),
            prisma.review.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: reviews,
            meta: { total, page, limit, totalPages },
        };
    }
}
