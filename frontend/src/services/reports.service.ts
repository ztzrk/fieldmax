import { api } from "@/lib/api";

export interface CreateReportData {
    subject: string;
    description: string;
    category: "SCAM" | "TECHNICAL" | "PAYMENT" | "OTHER";
}

export interface CreateReplyData {
    message: string;
}

export interface ReportReply {
    id: string;
    reportId: string;
    senderId: string;
    message: string;
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
    category: "SCAM" | "TECHNICAL" | "PAYMENT" | "OTHER";
    status: "PENDING" | "RESOLVED";
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
    };
    replies?: ReportReply[];
}

class ReportsService {
    async createReport(data: CreateReportData) {
        const response = await api.post("/reports", data);
        return response.data;
    }

    async getMyReports() {
        const response = await api.get<Report[]>("/reports/my");
        return response.data;
    }

    async getReportById(id: string) {
        const response = await api.get<Report>(`/reports/${id}`);
        return response.data;
    }

    async replyToReport(id: string, data: CreateReplyData) {
        const response = await api.post(`/reports/${id}/reply`, data);
        return response.data;
    }

    async getAllReports() {
        const response = await api.get<Report[]>("/admin/reports");
        return response.data;
    }
}

export const reportsService = new ReportsService();
