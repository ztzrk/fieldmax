import { z } from "zod";

export const userSchema = z.object({
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

export type UserFormValues = z.infer<typeof userSchema>;

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

export type UserApiResponse = z.infer<typeof userApiResponseSchema>;
export type UsersPaginatedApiResponse = z.infer<
    typeof usersPaginatedApiResponseSchema
>;
