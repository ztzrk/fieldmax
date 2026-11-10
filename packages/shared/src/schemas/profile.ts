import { z } from "zod";

export const userProfileSchema = z.object({
    userId: z.string(),
    profilePictureUrl: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    companyName: z.string().nullable().optional(),
    companyDescription: z.string().nullable().optional(),
    companyLogoUrl: z.string().nullable().optional(),
    companyWebsite: z.string().nullable().optional(),
});

export const profileResponseSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string().nullable().optional(),
    role: z.enum(["USER", "RENTER", "ADMIN"]),
    createdAt: z.string(),
    profile: userProfileSchema.nullable().optional(),
});

export type ProfileResponseSchema = z.infer<typeof profileResponseSchema>;

export const profileFormSchema = z.object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    companyName: z.string().optional(),
    companyDescription: z.string().optional(),
    companyWebsite: z
        .string()
        .url({ message: "Invalid URL" })
        .optional()
        .or(z.literal("")),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;

export const updateProfileSchema = z.object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    bio: z.string().optional(),
    address: z.string().optional(),
    profilePictureUrl: z.string().url().optional().nullable(),
    companyName: z.string().optional().nullable(),
    companyDescription: z.string().optional().nullable(),
    companyLogoUrl: z.string().url().optional().nullable(),
    companyWebsite: z.string().url().optional().nullable(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type UpdateProfileInput = UpdateProfile;

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type ChangePasswordInput = ChangePassword;
