import { z } from "zod";

export const createSportTypeSchema = z.object({
    name: z.string().min(1),
});
export type CreateSportType = z.infer<typeof createSportTypeSchema>;

export const updateSportTypeSchema = z.object({
    name: z.string().min(1).optional(),
});
export type UpdateSportType = z.infer<typeof updateSportTypeSchema>;
