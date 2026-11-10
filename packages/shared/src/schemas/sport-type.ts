import { z } from "zod";

export const createSportTypeSchema = z.object({
    name: z.string().min(1, "Name is required"),
});
export type CreateSportType = z.infer<typeof createSportTypeSchema>;
export const sportTypeFormSchema = createSportTypeSchema;
export type SportTypeFormSchema = CreateSportType;

export const updateSportTypeSchema = z.object({
    name: z.string().min(1).optional(),
});
export type UpdateSportType = z.infer<typeof updateSportTypeSchema>;

export const deleteMultipleSportTypesSchema = z.object({
    ids: z.array(z.string().uuid()),
});
export type DeleteMultipleSportTypes = z.infer<typeof deleteMultipleSportTypesSchema>;

export const sportTypeSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});
export type SportType = z.infer<typeof sportTypeSchema>;
export const sportTypeResponseSchema = sportTypeSchema;
export type SportTypeResponseSchema = SportType;

export const sportTypesResponseSchema = z.array(sportTypeResponseSchema);
export type SportTypesResponseSchema = z.infer<typeof sportTypesResponseSchema>;

export const sportTypesPaginatedResponseSchema = z.object({
    data: sportTypesResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});
export type SportTypesPaginatedResponseSchema = z.infer<
    typeof sportTypesPaginatedResponseSchema
>;

export const sportTypeQuerySchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});
export type SportTypeQuerySchema = z.infer<typeof sportTypeQuerySchema>;
