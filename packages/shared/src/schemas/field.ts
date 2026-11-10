import { z } from "zod";
import { reviewResponseSchema } from "./review";

export const fieldPhotoSchema = z.object({
    id: z.string().uuid().optional(),
    url: z.string().url(),
    isFeatured: z.boolean().default(false).optional(),
});

export type FieldPhoto = z.infer<typeof fieldPhotoSchema>;

export const createFieldSchema = z.object({
    name: z.string().min(1, "Field name is required"),
    venueId: z.string().uuid("Invalid venue ID"),
    sportTypeId: z.string().uuid("Invalid sport type ID"),
    pricePerHour: z.coerce.number().min(0, "Price must be at least 0"),
    description: z.string().optional().nullable(),
    isClosed: z.boolean().optional(),
});

export type CreateField = z.infer<typeof createFieldSchema>;
export const fieldFormSchema = createFieldSchema;
export type FieldFormSchema = CreateField;

export const updateFieldSchema = z.object({
    name: z.string().min(1).optional(),
    sportTypeId: z.string().uuid().optional(),
    pricePerHour: z.coerce.number().min(0).optional(),
    description: z.string().optional().nullable(),
    isClosed: z.boolean().optional(),
});

export type UpdateField = z.infer<typeof updateFieldSchema>;

export const rejectFieldSchema = z.object({
    rejectionReason: z.string().min(1, "Rejection reason is required"),
});

export type RejectField = z.infer<typeof rejectFieldSchema>;

export const toggleFieldClosureSchema = z.object({
    isClosed: z.boolean(),
});

export type ToggleFieldClosure = z.infer<typeof toggleFieldClosureSchema>;

export const deleteMultipleFieldsSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

export type DeleteMultipleFields = z.infer<typeof deleteMultipleFieldsSchema>;

export const getAvailabilitySchema = z.object({
    date: z
        .string()
        .date()
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export type GetAvailability = z.infer<typeof getAvailabilitySchema>;

export const fieldQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    sportTypeId: z.string().optional(),
    venueId: z.string().optional(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).optional(),
    isClosed: z.boolean().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
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
    rating: z.number().optional(),
    reviewCount: z.number().optional(),
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
    description: z.string().nullable().optional(),
    sportTypeId: z.string().uuid(),
    isClosed: z.boolean(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable().optional(),
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
                    id: z.string().optional(),
                    dayOfWeek: z.number(),
                    openTime: z.string(),
                    closeTime: z.string(),
                })
            )
            .optional(),
    }),
    photos: z.array(z.object({ id: z.string(), url: z.string() })).optional(),
    rating: z.number().optional(),
    reviewCount: z.number().optional(),
    ratingCounts: z.record(z.string(), z.number()).or(z.record(z.number(), z.number())).optional(),
    reviews: z
        .object({
            data: z.array(reviewResponseSchema),
            meta: z.object({
                total: z.number(),
                page: z.number(),
                limit: z.number(),
                totalPages: z.number(),
            }),
        })
        .optional(),
});

export type FieldDetailResponseSchema = z.infer<
    typeof fieldDetailResponseSchema
>;
