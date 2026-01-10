import { z } from "zod";
import { reviewFilterSchema } from "./pagination.schema";

export const createReviewSchema = z.object({
    bookingId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export type CreateReview = z.infer<typeof createReviewSchema>;
export const getReviewsQuerySchema = reviewFilterSchema;
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;
