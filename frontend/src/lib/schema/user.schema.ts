import { z } from "zod";

export const userFormSchema = z.object({
    fullName: z
        .string()
        .min(1, { message: "Nama lengkap tidak boleh kosong." }),
    email: z.string().email({ message: "Format email tidak valid." }),
    password: z
        .string()
        .min(8, { message: "Password minimal 8 karakter." })
        .optional()
        .or(z.literal("")),
    role: z.enum(["USER", "RENTER", "ADMIN"]),
});

export const userSchema = userFormSchema;

export type UserFormSchema = z.infer<typeof userFormSchema>;

export const userApiResponseSchema = z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    email: z.string().email(),
    role: z.enum(["USER", "RENTER", "ADMIN"]),
    createdAt: z.string().datetime(),
});

export const usersApiResponseSchema = z.array(userApiResponseSchema);

export const usersPaginatedApiResponseSchema = z.object({
    data: usersApiResponseSchema,
    meta: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }),
});

export type UserApiResponseSchema = z.infer<typeof userApiResponseSchema>;
export type UsersPaginatedApiResponseSchema = z.infer<
    typeof usersPaginatedApiResponseSchema
>;

export const userQuerySchema = z.object({
    page: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
});

export type UserQuerySchema = z.infer<typeof userQuerySchema>;
