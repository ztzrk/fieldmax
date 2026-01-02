import { z } from "zod";

export const createReviewSchema = z.object({
    bookingId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export type CreateReview = z.infer<typeof createReviewSchema>;
