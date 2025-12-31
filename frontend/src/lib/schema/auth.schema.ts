import { z } from "zod";

export const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const registerFormSchema = z
    .object({
        fullName: z.string().min(2, "Full name must be at least 2 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Confirm Password is required"),
        role: z.enum(["USER", "RENTER"], {
            errorMap: () => ({ message: "Please select a valid role" }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type loginFormSchema = z.infer<typeof loginFormSchema>;
export type registerFormSchema = z.infer<typeof registerFormSchema>;
