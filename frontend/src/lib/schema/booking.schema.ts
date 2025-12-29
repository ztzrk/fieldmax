import { z } from "zod";

export const createBookingSchema = z.object({
    fieldId: z.string().uuid(),
    bookingDate: z.string(), // YYYY-MM-DD
    startTime: z.string(), // HH:mm
    duration: z.number().min(1).max(24).optional(),
});

export type CreateBookingValues = z.infer<typeof createBookingSchema>;

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

export type Booking = z.infer<typeof bookingSchema>;

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
