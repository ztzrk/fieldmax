import { z } from "zod";

export const sportTypeResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

export const sportTypesResponseSchema = z.array(sportTypeResponseSchema);

export const sportTypesPaginatedResponseSchema = z.object({
    data: sportTypesResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export const sportTypeFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export const sportTypeQuerySchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
});

export type SportTypeResponseSchema = z.infer<typeof sportTypeResponseSchema>;
export type SportTypesResponseSchema = z.infer<typeof sportTypesResponseSchema>;
export type SportTypesPaginatedResponseSchema = z.infer<
    typeof sportTypesPaginatedResponseSchema
>;
export type SportTypeFormSchema = z.infer<typeof sportTypeFormSchema>;
export type SportTypeQuerySchema = z.infer<typeof sportTypeQuerySchema>;
