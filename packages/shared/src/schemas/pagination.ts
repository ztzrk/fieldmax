import { z } from "zod";

const splitQueryValues = (val: unknown): string[] => {
    if (val === undefined || val === null || val === "") return [];
    const items = Array.isArray(val)
        ? val.flatMap((v) => String(v).split(","))
        : String(val).split(",");
    return items.map((v) => v.trim()).filter(Boolean);
};

export function csvStringArray() {
    return z.preprocess((val) => {
        const cleaned = splitQueryValues(val);
        return cleaned.length > 0 ? cleaned : undefined;
    }, z.array(z.string()).optional());
}

export function csvEnumArray<const T extends readonly [string, ...string[]]>(
    values: T
) {
    return z.preprocess((val) => {
        const cleaned = splitQueryValues(val);
        return cleaned.length > 0 ? cleaned : undefined;
    }, z.array(z.enum(values as unknown as [T[number], ...T[number][]])).optional());
}

export function csvBooleanArray() {
    return z.preprocess((val) => {
        const cleaned = splitQueryValues(val)
            .map((v) => v.toLowerCase())
            .filter((v) => v === "true" || v === "false")
            .map((v) => v === "true");
        return cleaned.length > 0 ? Array.from(new Set(cleaned)) : undefined;
    }, z.array(z.boolean()).optional());
}

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    cursor: z.string().optional(),
    take: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().optional(),
    status: csvEnumArray(["DRAFT", "PENDING", "APPROVED", "REJECTED"]),
    isClosed: csvBooleanArray(),
    sportTypeId: csvStringArray(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    role: csvEnumArray(["ADMIN", "USER", "RENTER"]),
    isVerified: csvBooleanArray(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type PaginationInput = z.input<typeof paginationSchema>;

export const paginationMetaSchema = z.object({
    total: z.number(),
    page: z.number().optional(),
    limit: z.number(),
    totalPages: z.number(),
    nextCursor: z.string().nullable().optional(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
