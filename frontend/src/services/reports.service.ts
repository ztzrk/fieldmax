import { api } from "@/lib/api";
import { ApiResponse } from "@fieldmax/shared";

export interface CreateReportData {
    subject: string;
    description: string;
    category: "SCAM" | "TECHNICAL" | "PAYMENT" | "OTHER";
    attachmentUrl?: string;
}

export interface CreateReplyData {
    message: string;
    attachmentUrl?: string;
}

export interface ReportReply {
    id: string;
    reportId: string;
    senderId: string;
    message: string;
    attachmentUrl?: string | null;
    createdAt: string;
    sender?: {
        id: string;
        fullName: string;
        role: "USER" | "ADMIN" | "RENTER";
    };
}

export interface Report {
    id: string;
    userId: string;
    subject: string;
    description: string;
    attachmentUrl?: string | null;
    category: "SCAM" | "TECHNICAL" | "PAYMENT" | "OTHER";
    status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
    };
    replies?: ReportReply[];
    _count?: {
        replies: number;
    };
}

export interface GetAllReportsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

class ReportsService {
    async createReport(data: CreateReportData) {
        const response = await api.post("/reports", data);
        return response.data.data;
    }

    async getMyReports() {
        const response = await api.get<ApiResponse<Report[]>>("/reports/my");
        return response.data.data;
    }

    async getReportById(id: string) {
        const response = await api.get<ApiResponse<Report>>(`/reports/${id}`);
        return response.data.data;
    }

    async replyToReport(id: string, data: CreateReplyData) {
        const response = await api.post(`/reports/${id}/reply`, data);
        return response.data.data;
    }

    async uploadAttachment(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post<ApiResponse<{ url: string }>>(
            "/uploads/report-attachment",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        if (!response.data.data) {
            throw new Error("Gagal mengunggah lampiran");
        }
        return response.data.data;
    }

    async getAllReports(params?: GetAllReportsParams) {
        const response = await api.get<ApiResponse<any>>("/admin/reports", {
            params,
        });
        return response.data.data;
    }

    async resolve(id: string) {
        const response = await api.patch(`/admin/reports/${id}/resolve`);
        return response.data.data;
    }

    async reopen(id: string) {
        const response = await api.patch(`/admin/reports/${id}/reopen`);
        return response.data.data;
    }
}

export const reportsService = new ReportsService();
