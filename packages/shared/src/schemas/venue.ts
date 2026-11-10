import { z } from "zod";

export const venueScheduleSchema = z.object({
    id: z.string().uuid().optional(),
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z.string(),
    closeTime: z.string(),
});

export type VenueSchedule = z.infer<typeof venueScheduleSchema>;

export const venueScheduleResponseSchema = z.object({
    id: z.string().uuid().optional(),
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z.union([z.string(), z.date()]),
    closeTime: z.union([z.string(), z.date()]),
});

export type VenueScheduleResponse = z.infer<typeof venueScheduleResponseSchema>;

export const venuePhotoSchema = z.object({
    id: z.string().uuid(),
    url: z.string(),
    isFeatured: z.boolean(),
});

export type VenuePhoto = z.infer<typeof venuePhotoSchema>;

export const createVenueSchema = z.object({
    name: z.string().min(1, "Venue name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().optional().nullable(),
    district: z.string().optional().nullable(),
    province: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    renterId: z.string().uuid("Invalid renter ID"),
    schedules: z.array(venueScheduleSchema).optional(),
});

export type CreateVenue = z.infer<typeof createVenueSchema>;
export const venueFormSchema = createVenueSchema;
export const venueSchema = venueFormSchema;
export type VenueFormSchema = CreateVenue;

export const updateVenueSchema = z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().optional().nullable(),
    district: z.string().optional().nullable(),
    province: z.string().optional().nullable(),
    postalCode: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    schedules: z.array(venueScheduleSchema).optional(),
});

export type UpdateVenue = z.infer<typeof updateVenueSchema>;

export const rejectVenueSchema = z.object({
    rejectionReason: z.string().min(1, "Rejection reason is required"),
});

export type RejectVenue = z.infer<typeof rejectVenueSchema>;

export const deleteMultipleVenuesSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

export type DeleteMultipleVenues = z.infer<typeof deleteMultipleVenuesSchema>;

export const venueQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).optional(),
});

export type VenueQuerySchema = z.infer<typeof venueQuerySchema>;

export const venueResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable().optional(),
    createdAt: z.union([z.string(), z.date()]),
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

export type VenueResponseSchema = z.infer<typeof venueResponseSchema>;

export const fieldNestedResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    pricePerHour: z.number().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    sportTypeName: z.string().optional(),
    photos: z.array(z.object({ url: z.string() })).optional(),
});

export type FieldNestedResponseSchema = z.infer<
    typeof fieldNestedResponseSchema
>;

export const venueDetailResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable().optional(),
    photos: z.array(venuePhotoSchema).optional().default([]),
    schedules: z.array(venueScheduleResponseSchema).optional().default([]),
    fields: z.array(fieldNestedResponseSchema).optional().default([]),
});

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

export type VenuesPaginatedResponse = z.infer<
    typeof venuesPaginatedResponseSchema
>;

export const venuePublicPhotoSchema = z.object({
    url: z.string(),
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

export type VenuePublicSchema = z.infer<typeof venuePublicSchema>;

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
