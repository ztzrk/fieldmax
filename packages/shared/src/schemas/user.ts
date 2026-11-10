import { z } from "zod";
import { UserRole } from "./auth";

export const createUserSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.nativeEnum(UserRole).default(UserRole.USER),
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(UserRole).optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const deleteMultipleUsersSchema = z.object({
    ids: z.array(z.string().uuid()).min(1),
});

export type DeleteMultipleUsers = z.infer<typeof deleteMultipleUsersSchema>;

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
    createdAt: z.string(),
});

export type UserResponseSchema = z.infer<typeof userResponseSchema>;
export const usersResponseSchema = z.array(userResponseSchema);
export type UsersResponseSchema = z.infer<typeof usersResponseSchema>;

export const usersPaginatedResponseSchema = z.object({
    data: usersResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});
export type UsersPaginatedResponseSchema = z.infer<
    typeof usersPaginatedResponseSchema
>;

export const userQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
    isVerified: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type UserQuerySchema = z.infer<typeof userQuerySchema>;
