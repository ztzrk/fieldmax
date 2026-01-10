import { NextFunction, Request, Response } from "express";
import { CreateReport, CreateReply } from "./reports.schema";
import { ReportsService } from "./reports.service";
import { asyncHandler } from "../utils/asyncHandler";

export class ReportsController {
    constructor(private reportsService: ReportsService) {}
    public createReport = asyncHandler(async (req: Request, res: Response) => {
        const data: CreateReport = req.body;
        // @ts-ignore - Assuming authMiddleware attaches user to req
        const userId = req.user.id;
        const report = await this.reportsService.createReport(userId, data);
        res.status(201).json(report);
    });

    public getMyReports = asyncHandler(async (req: Request, res: Response) => {
        // @ts-ignore
        const userId = req.user.id;
        const reports = await this.reportsService.getUserReports(userId);
        res.status(200).json(reports);
    });

    public getAllReports = asyncHandler(async (req: Request, res: Response) => {
        const reports = await this.reportsService.getAllReports();
        res.status(200).json(reports);
    });

    public getReportById = asyncHandler(async (req: Request, res: Response) => {
        const reportId = req.params.id;
        // @ts-ignore
        const userId = req.user.id;
        // @ts-ignore
        const role = req.user.role;
        const isAdmin = role === "ADMIN";

        const report = await this.reportsService.getReportById(
            reportId,
            userId,
            isAdmin
        );
        res.status(200).json(report);
    });

    public replyToReport = asyncHandler(async (req: Request, res: Response) => {
        const reportId = req.params.id;
        const data: CreateReply = req.body;
        // @ts-ignore
        const userId = req.user.id;
        // @ts-ignore
        const role = req.user.role;
        const isAdmin = role === "ADMIN";

        const reply = await this.reportsService.replyToReport(
            reportId,
            userId,
            data,
            isAdmin
        );
        res.status(201).json(reply);
    });
}
