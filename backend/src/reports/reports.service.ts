import { Prisma } from "@prisma/client";
import prisma from "../db";
import { CreateReport, CreateReply } from "./reports.schema";
import { Pagination } from "../schemas/pagination.schema";
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

    public async getAllReports(query: Partial<Pagination>) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const pageNum = page ? Number(page) : undefined;
        const limitNum = limit ? Number(limit) : undefined;
        const isPaginated = pageNum !== undefined && limitNum !== undefined;
        const skip = isPaginated ? (pageNum! - 1) * limitNum! : 0;

        const whereCondition: Prisma.ReportWhereInput = search
            ? {
                  OR: [
                      { subject: { contains: search, mode: "insensitive" } },
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
                              email: { contains: search, mode: "insensitive" },
                          },
                      },
                  ],
              }
            : {};

        const orderByCondition: Prisma.ReportOrderByWithRelationInput =
            sortBy && sortOrder
                ? sortBy === "user"
                    ? { user: { fullName: sortOrder } }
                    : { [sortBy]: sortOrder }
                : { createdAt: "desc" };

        if (isPaginated) {
            const [reports, total] = await prisma.$transaction([
                prisma.report.findMany({
                    where: whereCondition,
                    skip: skip,
                    take: limitNum,
                    orderBy: orderByCondition,
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

    public async resolveReport(reportId: string) {
        const report = await prisma.report.findUnique({
            where: { id: reportId },
        });

        if (!report) {
            throw new NotFoundError("Report not found");
        }

        return prisma.report.update({
            where: { id: reportId },
            data: { status: "RESOLVED" },
        });
    }
}
