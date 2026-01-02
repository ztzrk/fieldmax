import { z } from "zod";

export const venueScheduleSchema = z.object({
    dayOfWeek: z.number().int(),
    openTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Time must be in HH:MM format",
    }),
    closeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Time must be in HH:MM format",
    }),
});

export type VenueSchedule = z.infer<typeof venueScheduleSchema>;

export const createVenueSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    city: z.string().optional(),
    district: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    description: z.string().optional(),
    renterId: z.string().uuid(),
    schedules: z.array(venueScheduleSchema).optional(),
});

export type CreateVenue = z.infer<typeof createVenueSchema>;

export const updateVenueSchema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    province: z.string().optional(),
    postalCode: z.string().optional(),
    description: z.string().optional(),
    schedules: z.array(venueScheduleSchema).optional(),
});

export type UpdateVenue = z.infer<typeof updateVenueSchema>;

export const rejectVenueSchema = z.object({
    rejectionReason: z.string().min(1),
});

export type RejectVenue = z.infer<typeof rejectVenueSchema>;
