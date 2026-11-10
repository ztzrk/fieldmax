import { z } from "zod";
import { fieldResponseSchema } from "./field";

export const BookingStatus = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED",
} as const;

export type BookingStatusType = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PaymentStatus = {
    PENDING: "PENDING",
    PAID: "PAID",
    EXPIRED: "EXPIRED",
    FAILED: "FAILED",
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const createBookingSchema = z.object({
    fieldId: z.string().uuid("Invalid Field ID"),
    bookingDate: z
        .string()
        .date()
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD")),
    startTime: z.string().min(1, "Start time is required"),
    duration: z.coerce
        .number()
        .min(1, "Duration must be at least 1 hour")
        .max(24, "Duration cannot exceed 24 hours")
        .optional()
        .default(1),
});

export type CreateBooking = z.infer<typeof createBookingSchema>;
export const bookingFormSchema = createBookingSchema;
export type BookingFormSchema = CreateBooking;

export const bookingQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type BookingQuerySchema = z.infer<typeof bookingQuerySchema>;

export const cancelBookingSchema = z.object({
    reason: z.string().optional(),
});

export type CancelBooking = z.infer<typeof cancelBookingSchema>;

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
    user: z
        .object({
            id: z.string(),
            fullName: z.string(),
            email: z.string(),
        })
        .optional(),
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
