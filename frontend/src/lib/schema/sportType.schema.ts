import { z } from "zod";

export const sportTypeApiResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

export const sportTypesApiResponseSchema = z.array(sportTypeApiResponseSchema);

export const sportTypesPaginatedApiResponseSchema = z.object({
    data: sportTypesApiResponseSchema,
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

export type SportTypeApiResponseSchema = z.infer<
    typeof sportTypeApiResponseSchema
>;
export type SportTypesPaginatedApiResponseSchema = z.infer<
    typeof sportTypesPaginatedApiResponseSchema
>;
export type SportTypeFormSchema = z.infer<typeof sportTypeFormSchema>;
export type SportTypeQuerySchema = z.infer<typeof sportTypeQuerySchema>;
