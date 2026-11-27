import { Prisma } from "@prisma/client";
import prisma from "../db";
import {
    CreateReport,
    CreateReply,
    GetAllReportsQuery,
} from "./reports.schema";
import {
    NotFoundError,
    ForbiddenError,
    ValidationError,
} from "../utils/errors";
import {
    sendReportReplyEmail,
    sendReportResolvedEmail,
} from "../lib/mailer";
import { logger } from "../utils/logger";

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

    public async getAllReports(query: GetAllReportsQuery) {
        const { page, limit, search, status, category, sortBy, sortOrder } =
            query;
        const pageNum = page ? Number(page) : undefined;
        const limitNum = limit ? Number(limit) : undefined;
        const isPaginated = pageNum !== undefined && limitNum !== undefined;
        const skip = isPaginated ? (pageNum! - 1) * limitNum! : 0;

        const whereCondition: Prisma.ReportWhereInput = {
            ...(status?.length ? { status: { in: status } } : {}),
            ...(category?.length ? { category: { in: category } } : {}),
            ...(search
                ? {
                      OR: [
                          {
                              subject: {
                                  contains: search,
                                  mode: "insensitive",
                              },
                          },
                          {
                              user: {
                                  fullName: {
                                      contains: search,
                                      mode: "insensitive",
                                  },
                              },
                          },
                          {
                              user: {
                                  email: {
                                      contains: search,
                                      mode: "insensitive",
                                  },
                              },
                          },
                      ],
                  }
                : {}),
        };

        const orderDir: Prisma.SortOrder =
            sortOrder === "asc" ? "asc" : "desc";
        let orderByCondition: Prisma.ReportOrderByWithRelationInput = {
            createdAt: "desc",
        };
        if (sortBy) {
            if (sortBy === "user" || sortBy === "user_fullName") {
                orderByCondition = { user: { fullName: orderDir } };
            } else if (
                [
                    "subject",
                    "category",
                    "status",
                    "createdAt",
                    "updatedAt",
                ].includes(sortBy)
            ) {
                orderByCondition = { [sortBy]: orderDir };
            }
        }

        const includeConfig = {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    replies: true,
                },
            },
        };

        if (isPaginated) {
            const [reports, total] = await prisma.$transaction([
                prisma.report.findMany({
                    where: whereCondition,
                    skip: skip,
                    take: limitNum,
                    orderBy: orderByCondition,
                    include: includeConfig,
                }),
                prisma.report.count({ where: whereCondition }),
            ]);

            const totalPages = Math.ceil(total / limitNum!);
            return {
                data: reports,
                meta: { total, page: pageNum, limit: limitNum, totalPages },
            };
        } else {
            const reports = await prisma.report.findMany({
                where: whereCondition,
                orderBy: orderByCondition,
                include: includeConfig,
            });
            return { data: reports };
        }
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
            include: {
                user: {
                    select: {
                        email: true,
                        fullName: true,
                    },
                },
            },
        });

        if (!report) {
            throw new NotFoundError("Report not found");
        }

        if (!isAdmin && report.userId !== senderId) {
            throw new ForbiddenError("You cannot reply to this report");
        }

        if (!isAdmin && report.status === "RESOLVED") {
            throw new ForbiddenError("You cannot reply to a resolved report.");
        }

        const nextStatus =
            isAdmin && report.status === "PENDING"
                ? "IN_PROGRESS"
                : report.status;

        const [reply] = await prisma.$transaction([
            prisma.reportReply.create({
                data: {
                    reportId,
                    senderId,
                    message: data.message,
                    attachmentUrl: data.attachmentUrl,
                },
            }),
            prisma.report.update({
                where: { id: reportId },
                data: {
                    status: nextStatus,
                    updatedAt: new Date(),
                },
            }),
        ]);

        if (isAdmin && report.user?.email) {
            sendReportReplyEmail(
                report.user.email,
                report.user.fullName,
                report.id,
                report.subject,
                data.message
            ).catch((err) => {
                logger.error("Failed to send report reply email", err);
            });
        }

        return reply;
    }

    public async resolveReport(reportId: string) {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
            include: {
                user: {
                    select: {
                        email: true,
                        fullName: true,
                    },
                },
            },
        });

        if (!report) {
            throw new NotFoundError("Report not found");
        }

        const updated = await prisma.report.update({
            where: { id: reportId },
            data: { status: "RESOLVED" },
        });

        if (report.user?.email) {
            sendReportResolvedEmail(
                report.user.email,
                report.user.fullName,
                report.id,
                report.subject
            ).catch((err) => {
                logger.error("Failed to send report resolved email", err);
            });
        }

        return updated;
    }

    public async reopenReport(reportId: string) {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
        });

        if (!report) {
            throw new NotFoundError("Report not found");
        }

        if (report.status !== "RESOLVED") {
            throw new ValidationError("Only resolved reports can be reopened");
        }

        return prisma.report.update({
            where: { id: reportId },
            data: { status: "IN_PROGRESS" },
        });
    }
}
