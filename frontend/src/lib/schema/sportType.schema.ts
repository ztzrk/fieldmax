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

export type SportTypeApiResponse = z.infer<typeof sportTypeApiResponseSchema>;
export type SportTypesPaginatedApiResponse = z.infer<
    typeof sportTypesPaginatedApiResponseSchema
>;
