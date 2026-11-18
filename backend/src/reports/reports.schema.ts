import { z } from "zod";

export const CreateReportSchema = z.object({
    subject: z.string().trim().min(1, "Subject is required").max(100),
    description: z.string().trim().min(1, "Description is required"),
    category: z.enum(["SCAM", "TECHNICAL", "PAYMENT", "OTHER"]),
    attachmentUrl: z.string().url("Invalid attachment URL").optional(),
});

export const CreateReplySchema = z.object({
    message: z.string().trim().min(1, "Message is required"),
    attachmentUrl: z.string().url("Invalid attachment URL").optional(),
});

export const GetAllReportsQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]).optional(),
    category: z.enum(["SCAM", "TECHNICAL", "PAYMENT", "OTHER"]).optional(),
    sortBy: z
        .enum([
            "subject",
            "category",
            "status",
            "createdAt",
            "updatedAt",
            "user",
            "user_fullName",
        ])
        .optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type CreateReport = z.infer<typeof CreateReportSchema>;
export type CreateReply = z.infer<typeof CreateReplySchema>;
export type GetAllReportsQuery = z.infer<typeof GetAllReportsQuerySchema>;
