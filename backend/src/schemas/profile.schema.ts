import { z } from "zod";

export const updateProfileSchema = z.object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    profilePictureUrl: z.string().url().optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;
