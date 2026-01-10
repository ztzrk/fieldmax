import { z } from "zod";

export const UserRole = {
    USER: "USER",
    RENTER: "RENTER",
    ADMIN: "ADMIN",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const userRoleSchema = z.nativeEnum(UserRole);

// Login
export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register
export const registerSchema = z
    .object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        email: z
            .string()
            .email("Invalid email address")
            .min(1, "Email is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm Password is required"),
        role: z.enum(["USER", "RENTER", "ADMIN"], {
            errorMap: () => ({ message: "Please select a valid role" }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterInput = z.infer<typeof registerSchema>;

// Forgot Password
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset Password
// Reset Password
const resetPasswordBase = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"), // Standardized to 8
    confirmPassword: z.string().min(1, "Confirm Password is required"),
});

export const resetPasswordSchema = resetPasswordBase.refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// For Frontend Form (omitting token)
const resetPasswordFormBase = resetPasswordBase.omit({ token: true });
type ResetPasswordFormBase = z.infer<typeof resetPasswordFormBase>;

export const resetPasswordFormSchema = resetPasswordFormBase.refine(
    (data: ResetPasswordFormBase) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
