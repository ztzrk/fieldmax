import { z } from "zod";
import { UserRole } from "@prisma/client";

// Login User
export const loginUserSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(1),
});

export type LoginUser = z.infer<typeof loginUserSchema>;

// Register User
export const registerUserSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email().min(1),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
    role: z.nativeEnum(UserRole),
    confirmPassword: z.string().min(1),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;

// Forgot Password
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email is required" }),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

// Reset Password
export const resetPasswordSchema = z.object({
    token: z.string().min(1, { message: "Token is required" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
        .string()
        .min(1, { message: "Confirm Password is required" }),
});

export type ResetPassword = z.infer<typeof resetPasswordSchema>;
