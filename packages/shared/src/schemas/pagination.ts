import { z } from "zod";

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    cursor: z.string().optional(),
    take: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).optional(),
    isClosed: z.preprocess((val) => {
        if (typeof val === "string") {
            if (val === "true") return true;
            if (val === "false") return false;
        }
        return val;
    }, z.boolean().optional()),
    sportTypeId: z.string().optional(),
    role: z.enum(["ADMIN", "USER", "RENTER"]).optional(),
    isVerified: z.preprocess((val) => {
        if (typeof val === "string") {
            if (val === "true") return true;
            if (val === "false") return false;
        }
        return val;
    }, z.boolean().optional()),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type PaginationInput = Pagination;

export const paginationMetaSchema = z.object({
    total: z.number(),
    page: z.number().optional(),
    limit: z.number(),
    totalPages: z.number(),
    nextCursor: z.string().nullable().optional(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
