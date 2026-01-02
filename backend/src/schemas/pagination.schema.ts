import { z } from "zod";

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    isClosed: z.preprocess((val) => {
        if (typeof val === "string") {
            if (val === "true") return true;
            if (val === "false") return false;
        }
        return val;
    }, z.boolean().optional()),
    sportTypeId: z.string().optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export const reviewFilterSchema = paginationSchema.extend({
    ratings: z.preprocess((val) => {
        if (typeof val === "string") return [Number(val)];
        if (Array.isArray(val)) return val.map(Number);
        return val;
    }, z.array(z.number().int()).optional()),
});

export type ReviewFilter = z.infer<typeof reviewFilterSchema>;
