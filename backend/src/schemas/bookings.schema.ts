import { z } from "zod";

export const createBookingSchema = z.object({
    fieldId: z.string().uuid(),
    bookingDate: z
        .string()
        .date()
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), // z.string().date() validates YYYY-MM-DD
    startTime: z.string().min(1),
    duration: z.number().optional(),
});

export type CreateBooking = z.infer<typeof createBookingSchema>;
