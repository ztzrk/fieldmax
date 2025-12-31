import { z } from "zod";

export const venueFormSchema = z.object({
    name: z.string().min(1, { message: "Nama venue tidak boleh kosong." }),
    address: z.string().min(1, { message: "Alamat tidak boleh kosong." }),
    city: z.string().min(1, { message: "Kota tidak boleh kosong." }),
    district: z.string().min(1, { message: "Kecamatan tidak boleh kosong." }),
    province: z.string().min(1, { message: "Provinsi tidak boleh kosong." }),
    postalCode: z.string().min(1, { message: "Kode Pos tidak boleh kosong." }),
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

export const venueApiResponseSchema = z.object({
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

const fieldNestedResponseSchema = z.object({
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

export type FieldNestedApiResponseSchema = z.infer<
    typeof fieldNestedResponseSchema
>;

export type VenueDetailApiResponseSchema = z.infer<
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

export type VenueApiResponseSchema = z.infer<typeof venueApiResponseSchema>;
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
    city: z.string().optional(),
    district: z.string().optional(),
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

export type VenuePublicSchema = z.infer<typeof venuePublicSchema>;
