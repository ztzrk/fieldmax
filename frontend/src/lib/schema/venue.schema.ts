import { z } from "zod";

export const venueSchema = z.object({
    name: z.string().min(1, { message: "Nama venue tidak boleh kosong." }),
    address: z.string().min(1, { message: "Alamat tidak boleh kosong." }),
    renterId: z
        .string()
        .uuid({ message: "Anda harus memilih seorang renter." }),
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

export type VenueFormValues = z.infer<typeof venueSchema>;

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

export const venueApiResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    description: z.string().nullable(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
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
});

const fieldNestedSchema = z.object({
    id: z.string(),
    name: z.string(),
    pricePerHour: z.number(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    sportTypeName: z.string(),
    photos: z.array(z.object({ url: z.string() })).optional(),
});

export const venueDetailApiResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string(),
    description: z.string().nullable(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]),
    rejectionReason: z.string().nullable(),
    renterId: z.string().uuid(),
    renterName: z.string(),
    photos: z.array(venuePhotoSchema),
    schedules: z.array(venueScheduleSchema).optional(),
    fields: z.array(fieldNestedSchema),
});

export type fieldNestedApiResponse = z.infer<typeof fieldNestedSchema>;

export type VenueDetailApiResponse = z.infer<
    typeof venueDetailApiResponseSchema
>;

export const venuesListApiResponseSchema = z.array(venueApiResponseSchema);

export const venuesPaginatedApiResponseSchema = z.object({
    data: venuesListApiResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type VenueApiResponse = z.infer<typeof venueApiResponseSchema>;
export type VenuesPaginatedApiResponse = z.infer<
    typeof venuesPaginatedApiResponseSchema
>;
const venuePublicPhotoSchema = z.object({
    url: z.string().url(),
    id: z.string().optional(),
});

export const venuePublicSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    address: z.string().optional(),
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
});

export type VenuePublic = z.infer<typeof venuePublicSchema>;
