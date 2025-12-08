import { z } from "zod";

export const fieldApiResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    pricePerHour: z.number().min(0),
    sportType: z.object({
        name: z.string(),
    }),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    venue: z.object({
        name: z.string(),
    }),
});

export const fieldFormSchema = z.object({
    name: z.string().min(1, "Field name is required."),
    pricePerHour: z.coerce.number().min(0, "Price must be a positive number."),
    sportTypeId: z.string().uuid("You must select a sport type."),
    description: z.string().optional(),
});

export type FieldFormValues = z.infer<typeof fieldFormSchema>;

export const fieldsListApiResponseSchema = z.array(fieldApiResponseSchema);

export type FieldApiResponse = z.infer<typeof fieldApiResponseSchema>;
