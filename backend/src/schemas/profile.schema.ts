import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    profilePictureUrl: z.string().url().optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
