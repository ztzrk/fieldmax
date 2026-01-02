import { z } from "zod";
import { UserRole } from "@prisma/client";

export const updateUserSchema = z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(UserRole).optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
