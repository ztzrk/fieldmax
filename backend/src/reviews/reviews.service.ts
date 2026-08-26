import prisma from "../db";
import { CreateReview } from "../schemas/reviews.schema";
import { ReviewFilter } from "../schemas/pagination.schema";
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
} from "../utils/errors";

export class ReviewsService {
    public async create(userId: string, data: CreateReview) {
        // 1. Verify booking exists and belongs to user
        const booking = await prisma.booking.findUnique({
            where: { id: data.bookingId },
            include: { review: true },
        });

        if (!booking) {
            throw new NotFoundError("Booking not found");
        }

        if (booking.userId !== userId) {
            throw new ForbiddenError("Unauthorized to review this booking");
        }

        // 2. Verify booking is completed (or confirmed and past time)
        const bookingDateStr = booking.bookingDate.toISOString().split("T")[0];
        const hours = booking.endTime.getUTCHours().toString().padStart(2, "0");
        const minutes = booking.endTime.getUTCMinutes().toString().padStart(2, "0");
        const endDateTime = new Date(
            `${bookingDateStr}T${hours}:${minutes}:00.000+07:00`
        );

        const isCompleted = booking.status === "COMPLETED";
        const isPastAndConfirmed =
            booking.status === "CONFIRMED" && new Date() >= endDateTime;

        if (!isCompleted && !isPastAndConfirmed) {
            throw new ValidationError("Cannot review an incomplete booking");
        }

        // 3. Check if review already exists
        if (booking.review) {
            throw new ConflictError("Booking already reviewed");
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

    public async getByFieldId(fieldId: string, query: ReviewFilter) {
        const { page = 1, limit = 10, cursor, take, ratings } = query;
        const skip = (page - 1) * limit;

        const where: any = { fieldId };
        if (ratings && ratings.length > 0) {
            where.rating = { in: ratings };
        }

        const paginationArgs: any = {
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
            take: take ?? Number(limit),
        };

        if (cursor) {
            paginationArgs.cursor = { id: cursor };
            paginationArgs.skip = 1;
        } else {
            paginationArgs.skip = Number(skip);
        }

        const [reviews, total] = await prisma.$transaction([
            prisma.review.findMany(paginationArgs),
            prisma.review.count({ where }),
        ]);

        const nextCursor =
            reviews.length > 0 ? reviews[reviews.length - 1].id : null;
        const totalPages = Math.ceil(total / (take ?? limit));

        return {
            data: reviews,
            meta: {
                total,
                page: cursor ? undefined : page,
                limit: take ?? limit,
                totalPages,
                nextCursor,
            },
        };
    }
}
