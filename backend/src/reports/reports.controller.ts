import { NextFunction, Request, Response } from "express";
import { CreateReport, CreateReply } from "./reports.schema";
import { ReportsService } from "./reports.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class ReportsController {
    constructor(private reportsService: ReportsService) {}
    public createReport = asyncHandler(async (req: Request, res: Response) => {
        const data: CreateReport = req.body;
        const userId = req.user!.id;
        const report = await this.reportsService.createReport(userId, data);
        sendSuccess(res, report, "Report created", 201);
    });

    public getMyReports = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const reports = await this.reportsService.getUserReports(userId);
        sendSuccess(res, reports, "My reports retrieved");
    });

    public getAllReports = asyncHandler(async (req: Request, res: Response) => {
        const reports = await this.reportsService.getAllReports();
        sendSuccess(res, reports, "All reports retrieved");
    });

    public getReportById = asyncHandler(async (req: Request, res: Response) => {
        const reportId = req.params.id;
        const userId = req.user!.id;
        const role = req.user!.role;
        const isAdmin = role === "ADMIN";

        const report = await this.reportsService.getReportById(
            reportId,
            userId,
            isAdmin
        );
        sendSuccess(res, report, "Report details retrieved");
    });

    public replyToReport = asyncHandler(async (req: Request, res: Response) => {
        const reportId = req.params.id;
        const data: CreateReply = req.body;
        const userId = req.user!.id;
        const role = req.user!.role;
        const isAdmin = role === "ADMIN";

        const reply = await this.reportsService.replyToReport(
            reportId,
            userId,
            data,
            isAdmin
        );
        sendSuccess(res, reply, "Reply created", 201);
    });
}
