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

export type ProfileResponse = z.infer<typeof profileResponseSchema>;
