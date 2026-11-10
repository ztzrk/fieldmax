import { z } from "zod";
import { paginationSchema } from "./pagination";

export const createReviewSchema = z.object({
    bookingId: z.string().uuid("Invalid booking ID"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
});

export type CreateReview = z.infer<typeof createReviewSchema>;
export type CreateReviewInput = CreateReview;
export const reviewFormSchema = createReviewSchema;
export type ReviewFormSchema = CreateReview;

export const reviewFilterSchema = paginationSchema.extend({
    ratings: z.preprocess((val) => {
        if (typeof val === "string") return [Number(val)];
        if (Array.isArray(val)) return val.map(Number);
        return val;
    }, z.array(z.number().int()).optional()),
});

export type ReviewFilter = z.infer<typeof reviewFilterSchema>;
export const getReviewsQuerySchema = reviewFilterSchema;
export type GetReviewsQuery = ReviewFilter;

export const reviewResponseSchema = z.object({
    id: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().nullable().optional(),
    userId: z.string().uuid(),
    fieldId: z.string().uuid(),
    bookingId: z.string().uuid(),
    createdAt: z.string().or(z.date()),
    user: z.object({
        fullName: z.string(),
        profile: z
            .object({
                profilePictureUrl: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
    }),
});

export type ReviewResponse = z.infer<typeof reviewResponseSchema>;
export type ReviewResponseSchema = ReviewResponse;

export const reviewsPaginatedResponseSchema = z.object({
    data: z.array(reviewResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type ReviewsPaginatedResponseSchema = z.infer<
    typeof reviewsPaginatedResponseSchema
>;
