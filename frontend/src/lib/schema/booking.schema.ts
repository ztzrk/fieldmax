import { z } from "zod";

export const bookingFormSchema = z.object({
    fieldId: z.string().uuid("Invalid Field ID"),
    bookingDate: z.string().min(1, "Booking date is required"), // YYYY-MM-DD
    startTime: z.string().min(1, "Start time is required"), // HH:mm
    duration: z
        .number()
        .min(1, "Duration must be at least 1 hour")
        .max(24, "Duration cannot exceed 24 hours")
        .optional(),
});

export const bookingQuerySchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
});

export type BookingQuerySchema = z.infer<typeof bookingQuerySchema>;

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;

export const bookingSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    fieldId: z.string().uuid(),
    bookingDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    totalPrice: z.number(),
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
    snapToken: z.string().nullable().optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "EXPIRED", "FAILED"]),
    createdAt: z.string(),
});

export type BookingApiResponseSchema = z.infer<typeof bookingSchema> & {
    field?: {
        name: string;
        venue?: {
            name: string;
            address: string;
            city?: string;
            district?: string;
            province?: string;
            postalCode?: string;
        };
    };
};

export const bookingApiResponseSchema = z.object({
    data: bookingSchema,
    message: z.string().optional(),
});

export const bookingsPaginatedApiResponseSchema = z.object({
    data: z.array(bookingSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});
