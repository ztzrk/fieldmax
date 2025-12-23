import { z } from "zod";

export const fieldApiResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    pricePerHour: z.number().min(0),
    isClosed: z.boolean(),
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
    description: z.string().nullable().optional(),
    isClosed: z.boolean().optional(),
});

export const fieldDetailApiResponseSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string(),
        pricePerHour: z.number(),
        description: z.string().nullable(),
        sportTypeId: z.string().uuid(),
        isClosed: z.boolean(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
        rejectionReason: z.string().nullable(),
        photos: z
            .array(z.object({ id: z.string(), url: z.string() }))
            .optional(),
    })
    .passthrough();

export type Field = z.infer<typeof fieldDetailApiResponseSchema>;

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
