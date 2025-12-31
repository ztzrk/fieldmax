import { z } from "zod";
import { fieldResponseSchema } from "./field.schema";

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

export const bookingResponseSchema = z.object({
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
    field: fieldResponseSchema,
    review: z
        .object({
            id: z.string(),
            rating: z.number(),
        })
        .optional()
        .nullable(),
});

export type BookingResponseSchema = z.infer<typeof bookingResponseSchema>;

export const bookingsResponseSchema = z.object({
    data: z.array(bookingResponseSchema),
    message: z.string().optional(),
});

export const bookingsPaginatedResponseSchema = z.object({
    data: z.array(bookingResponseSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type BookingsPaginatedResponseSchema = z.infer<
    typeof bookingsPaginatedResponseSchema
>;
