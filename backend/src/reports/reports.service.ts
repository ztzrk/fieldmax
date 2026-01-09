import prisma from "../db";
import { CreateReport, CreateReply } from "./reports.schema";
import { NotFoundError, ForbiddenError } from "../utils/errors";

export class ReportsService {
    public async createReport(userId: string, data: CreateReport) {
        return prisma.report.create({
            data: {
                userId,
                ...data,
            },
        });
    }

    public async getUserReports(userId: string) {
        return prisma.report.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                replies: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    }

    public async getAllReports() {
        return prisma.report.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                replies: true,
            },
        });
    }

    public async getReportById(
        reportId: string,
        userId: string,
        isAdmin: boolean
    ) {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                replies: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                fullName: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        if (!report) {
            throw new NotFoundError("Report not found");
        }

        if (!isAdmin && report.userId !== userId) {
            throw new ForbiddenError("You do not have access to this report");
        }

        return report;
    }

    public async replyToReport(
        reportId: string,
        senderId: string,
        data: CreateReply,
        isAdmin: boolean
    ) {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
        });

        if (!report) {
            throw new NotFoundError("Report not found");
        }

        if (!isAdmin && report.userId !== senderId) {
            throw new ForbiddenError("You cannot reply to this report");
        }

        const reply = await prisma.reportReply.create({
            data: {
                reportId,
                senderId,
                message: data.message,
            },
        });

        // Optionally update report status or notify user
        if (isAdmin && report.status === "PENDING") {
            // await prisma.report.update({
            //     where: { id: reportId },
            //     data: { status: "RESOLVED" }, // Example logic
            // });
        }

        return reply;
    }
}
