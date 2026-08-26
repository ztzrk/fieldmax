import { z } from "zod";
import { UserRole } from "@prisma/client";

export const createUserSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.nativeEnum(UserRole).default(UserRole.USER),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(UserRole).optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const deleteMultipleUsersSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

export type DeleteMultipleUsers = z.infer<typeof deleteMultipleUsersSchema>;
