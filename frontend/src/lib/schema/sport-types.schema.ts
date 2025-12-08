import { z } from "zod";

export const sportTypeSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Nama tipe olahraga tidak boleh kosong." }),
    iconName: z.string().optional(),
});

export type SportTypeFormValues = z.infer<typeof sportTypeSchema>;

export const sportTypeApiResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    iconName: z.string().optional(),
    createdAt: z.string().datetime(),
});

export const sportTypesApiResponseSchema = z.array(sportTypeApiResponseSchema);

export type SportTypesApiResponse = z.infer<typeof sportTypesApiResponseSchema>;
