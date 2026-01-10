"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordFormSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.registerSchema = exports.loginSchema = exports.userRoleSchema = exports.UserRole = void 0;
const zod_1 = require("zod");
exports.UserRole = {
    USER: "USER",
    RENTER: "RENTER",
    ADMIN: "ADMIN",
};
exports.userRoleSchema = zod_1.z.nativeEnum(exports.UserRole);
// Login
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
// Register
exports.registerSchema = zod_1.z
    .object({
    fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters"),
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: zod_1.z.string().min(1, "Confirm Password is required"),
    role: zod_1.z.enum(["USER", "RENTER", "ADMIN"], {
        errorMap: () => ({ message: "Please select a valid role" }),
    }),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// Forgot Password
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
});
// Reset Password
// Reset Password
const resetPasswordBase = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"), // Standardized to 8
    confirmPassword: zod_1.z.string().min(1, "Confirm Password is required"),
});
exports.resetPasswordSchema = resetPasswordBase.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// For Frontend Form (omitting token)
const resetPasswordFormBase = resetPasswordBase.omit({ token: true });
exports.resetPasswordFormSchema = resetPasswordFormBase.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
