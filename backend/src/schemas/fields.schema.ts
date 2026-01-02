import { z } from "zod";

// Create Field
export const createFieldSchema = z.object({
    name: z.string().min(1),
    venueId: z.string().uuid(),
    sportTypeId: z.string().uuid(),
    pricePerHour: z.number().min(0),
    description: z.string().optional(),
    isClosed: z.boolean().optional(),
});

export type CreateField = z.infer<typeof createFieldSchema>;

// Update Field
export const updateFieldSchema = z.object({
    name: z.string().min(1).optional(),
    sportTypeId: z.string().uuid().optional(),
    isClosed: z.boolean().optional(),
});

export type UpdateField = z.infer<typeof updateFieldSchema>;

// Reject Field
export const rejectFieldSchema = z.object({
    rejectionReason: z.string().min(1),
});

export type RejectField = z.infer<typeof rejectFieldSchema>;

// Toggle Closure
export const toggleFieldClosureSchema = z.object({
    isClosed: z.boolean(),
});

export type ToggleFieldClosure = z.infer<typeof toggleFieldClosureSchema>;

// Delete Multiple
export const deleteMultipleFieldsSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

export type DeleteMultipleFields = z.infer<typeof deleteMultipleFieldsSchema>;

// Schedule Override
export const scheduleOverrideSchema = z
    .object({
        overrideDate: z
            .string()
            .date()
            .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
        isClosed: z.boolean(),
        openTime: z.string().optional(),
        closeTime: z.string().optional(),
    })
    .refine(
        (data) => {
            if (!data.isClosed) {
                return !!data.openTime && !!data.closeTime;
            }
            return true;
        },
        {
            message:
                "openTime and closeTime are required when isClosed is false",
            path: ["openTime"],
        }
    );

export type ScheduleOverride = z.infer<typeof scheduleOverrideSchema>;

// Authenticated Availability
export const getAvailabilitySchema = z.object({
    date: z
        .string()
        .date()
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export type GetAvailability = z.infer<typeof getAvailabilitySchema>;
