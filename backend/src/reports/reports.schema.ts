import { z } from "zod";

export const CreateReportSchema = z.object({
    subject: z.string().min(1, "Subject is required").max(100),
    description: z.string().min(1, "Description is required"),
    category: z.enum(["SCAM", "TECHNICAL", "PAYMENT", "OTHER"]),
});

export const CreateReplySchema = z.object({
    message: z.string().min(1, "Message is required"),
});

export type CreateReport = z.infer<typeof CreateReportSchema>;
export type CreateReply = z.infer<typeof CreateReplySchema>;
