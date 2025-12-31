import { z } from "zod";

export const reviewFormSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    bookingId: z.string().uuid(),
});

export type ReviewFormSchema = z.infer<typeof reviewFormSchema>;

export const reviewResponseSchema = z.object({
    id: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().nullable(), // backend might return null
    userId: z.string().uuid(),
    fieldId: z.string().uuid(),
    bookingId: z.string().uuid(),
    createdAt: z.string().datetime(),
    user: z.object({
        fullName: z.string(),
        profile: z
            .object({
                profilePictureUrl: z.string().nullable(),
            })
            .nullable()
            .optional(),
    }),
});

export type ReviewResponseSchema = z.infer<typeof reviewResponseSchema>;

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
