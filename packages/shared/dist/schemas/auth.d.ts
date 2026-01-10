import { z } from "zod";
export declare const UserRole: {
    readonly USER: "USER";
    readonly RENTER: "RENTER";
    readonly ADMIN: "ADMIN";
};
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export declare const userRoleSchema: z.ZodNativeEnum<{
    readonly USER: "USER";
    readonly RENTER: "RENTER";
    readonly ADMIN: "ADMIN";
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    role: z.ZodEnum<["USER", "RENTER", "ADMIN"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
    role: "USER" | "RENTER" | "ADMIN";
}, {
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
    role: "USER" | "RENTER" | "ADMIN";
}>, {
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
    role: "USER" | "RENTER" | "ADMIN";
}, {
    email: string;
    password: string;
    fullName: string;
    confirmPassword: string;
    role: "USER" | "RENTER" | "ADMIN";
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export declare const resetPasswordSchema: z.ZodEffects<z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    confirmPassword: string;
    token: string;
}, {
    password: string;
    confirmPassword: string;
    token: string;
}>, {
    password: string;
    confirmPassword: string;
    token: string;
}, {
    password: string;
    confirmPassword: string;
    token: string;
}>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export declare const resetPasswordFormSchema: z.ZodEffects<z.ZodObject<Omit<{
    token: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
}, "token">, "strip", z.ZodTypeAny, {
    password: string;
    confirmPassword: string;
}, {
    password: string;
    confirmPassword: string;
}>, {
    password: string;
    confirmPassword: string;
}, {
    password: string;
    confirmPassword: string;
}>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
