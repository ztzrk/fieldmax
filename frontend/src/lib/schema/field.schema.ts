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

export const fieldDetailApiResponseSchema = z
    .object({
        name: z.string(),
        pricePerHour: z.number(),
        description: z.string().nullable(),
        sportTypeId: z.string().uuid(),
    })
    .passthrough();

export type FieldFormValues = z.infer<typeof fieldFormSchema>;

export const fieldsListApiResponseSchema = z.array(fieldApiResponseSchema);

export const fieldsPaginatedApiResponseSchema = z.object({
    data: fieldsListApiResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type FieldApiResponse = z.infer<typeof fieldApiResponseSchema>;
export type FieldsPaginatedApiResponse = z.infer<
    typeof fieldsPaginatedApiResponseSchema
>;
