import { z } from "zod";

export const fieldFormSchema = z.object({
    name: z.string().min(1, "Field name is required."),
    pricePerHour: z.coerce.number().min(0, "Price must be a positive number."),
    sportTypeId: z.string().uuid("You must select a sport type."),
    description: z.string().nullable().optional(),
    isClosed: z.boolean().optional(),
    venueId: z.string().uuid(),
});

export type FieldFormSchema = z.infer<typeof fieldFormSchema>;

export const fieldQuerySchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    isClosed: z.boolean().optional(),
    sportTypeId: z.string().uuid().optional(),
});

export type FieldQuerySchema = z.infer<typeof fieldQuerySchema>;

export const fieldResponseSchema = z.object({
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
        address: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        province: z.string().optional(),
        postalCode: z.string().optional(),
    }),
    photos: z.array(z.object({ url: z.string() })).optional(),
});

export type FieldResponseSchema = z.infer<typeof fieldResponseSchema>;

export const fieldsListResponseSchema = z.array(fieldResponseSchema);

export const fieldsPaginatedResponseSchema = z.object({
    data: fieldsListResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type FieldsPaginatedResponseSchema = z.infer<
    typeof fieldsPaginatedResponseSchema
>;

export const fieldDetailResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    pricePerHour: z.number(),
    description: z.string().nullable(),
    sportTypeId: z.string().uuid(),
    isClosed: z.boolean(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable(),
    sportType: z.object({
        id: z.string(),
        name: z.string(),
    }),
    venue: z.object({
        id: z.string(),
        name: z.string(),
        schedules: z
            .array(
                z.object({
                    id: z.string(),
                    dayOfWeek: z.number(),
                    openTime: z.string(),
                    closeTime: z.string(),
                })
            )
            .optional(),
    }),
    photos: z.array(z.object({ id: z.string(), url: z.string() })).optional(),
});

export type FieldDetailResponseSchema = z.infer<
    typeof fieldDetailResponseSchema
>;
