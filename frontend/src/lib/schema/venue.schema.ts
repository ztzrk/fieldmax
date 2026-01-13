import { z } from "zod";

export const venueFormSchema = z.object({
    name: z.string().min(1, { message: "Venue name is required." }),
    address: z.string().min(1, { message: "Address is required." }),
    city: z.string().min(1, { message: "City is required." }),
    district: z.string().min(1, { message: "District is required." }),
    province: z.string().min(1, { message: "Province is required." }),
    postalCode: z.string().min(1, { message: "Postal code is required." }),
    renterId: z.string().uuid({ message: "Renter is required." }),
    description: z.string().optional().nullable(),
    schedules: z
        .array(
            z.object({
                dayOfWeek: z.number().int().min(0).max(6),
                openTime: z.string(), // "HH:MM"
                closeTime: z.string(), // "HH:MM"
            })
        )
        .optional(),
});

export const venueSchema = venueFormSchema;

export const venueQuerySchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
});

export type VenueQuerySchema = z.infer<typeof venueQuerySchema>;

export type VenueFormSchema = z.infer<typeof venueFormSchema>;

export const venueScheduleSchema = z.object({
    id: z.string().uuid(),
    dayOfWeek: z.number().int(),
    openTime: z.string(),
    closeTime: z.string(),
});

const venuePhotoSchema = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    isFeatured: z.boolean(),
});

export const venueResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    description: z.string().nullable(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    renterId: z.string().uuid(),
    renter: z.object({
        fullName: z.string(),
        email: z.string().email(),
    }),
    photos: z.array(venuePhotoSchema).optional(),
    _count: z
        .object({
            fields: z.number().int(),
        })
        .optional(),
    bookingCount: z.number().optional(),
});

const fieldNestedResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    pricePerHour: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    sportTypeName: z.string(),
    photos: z.array(z.object({ url: z.string() })).optional(),
});

export const venueDetailResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    city: z.string().optional(),
    district: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    description: z.string().nullable(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable(),
    photos: z.array(venuePhotoSchema),
    schedules: z.array(venueScheduleSchema).optional(),
    fields: z.array(fieldNestedResponseSchema),
});

export type FieldNestedResponseSchema = z.infer<
    typeof fieldNestedResponseSchema
>;

export type VenueDetailResponseSchema = z.infer<
    typeof venueDetailResponseSchema
>;

export const venuesListResponseSchema = z.array(venueResponseSchema);

export const venuesPaginatedResponseSchema = z.object({
    data: venuesListResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type VenueResponseSchema = z.infer<typeof venueResponseSchema>;
export type VenuesPaginatedResponse = z.infer<
    typeof venuesPaginatedResponseSchema
>;
export const venuePublicPhotoSchema = z.object({
    url: z.string().url(),
    id: z.string().optional(),
});

export const venuePublicSchema = z.object({
    id: z.string().uuid(),
    renterId: z.string().uuid(),
    name: z.string(),
    address: z.string().optional(),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    renter: z.object({
        fullName: z.string(),
        email: z.string().email(),
    }),
    photos: z.array(venuePublicPhotoSchema).optional(),
    _count: z
        .object({
            fields: z.number().int(),
        })
        .optional(),
    bookingCount: z.number().optional(),
});

export const venuesPublicListResponseSchema = z.array(venuePublicSchema);

export const venuesPublicPaginatedResponseSchema = z.object({
    data: venuesPublicListResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type VenuePublicSchema = z.infer<typeof venuePublicSchema>;
