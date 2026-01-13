import { z } from "zod";

export const userFormSchema = z.object({
    fullName: z.string().min(1, { message: "Full name is required." }),
    email: z.string().email({ message: "Email is required." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .optional()
        .or(z.literal("")),
    role: z.enum(["USER", "RENTER", "ADMIN"]),
});

export const userSchema = userFormSchema;

export type UserFormSchema = z.infer<typeof userFormSchema>;

export const userResponseSchema = z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "RENTER", "ADMIN"]),
    createdAt: z.string().datetime(),
});

export const usersResponseSchema = z.array(userResponseSchema);

export const usersPaginatedResponseSchema = z.object({
    data: usersResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type UserResponseSchema = z.infer<typeof userResponseSchema>;
export type UsersPaginatedResponseSchema = z.infer<
    typeof usersPaginatedResponseSchema
>;

export const userQuerySchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
    role: z.enum(["USER", "RENTER", "ADMIN"]).optional(),
    isVerified: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type UserQuerySchema = z.infer<typeof userQuerySchema>;
