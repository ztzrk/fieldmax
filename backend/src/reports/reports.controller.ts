import { NextFunction, Request, Response } from "express";
import { CreateReport, CreateReply } from "./reports.schema";
import { ReportsService } from "./reports.service";

export class ReportsController {
    constructor(private reportsService: ReportsService) {}
    public createReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data: CreateReport = req.body;
            // @ts-ignore - Assuming authMiddleware attaches user to req
            const userId = req.user.id;
            const report = await this.reportsService.createReport(userId, data);
            res.status(201).json(report);
        } catch (error) {
            next(error);
        }
    };

    public getMyReports = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const reports = await this.reportsService.getUserReports(userId);
            res.status(200).json(reports);
        } catch (error) {
            next(error);
        }
    };

    public getAllReports = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const reports = await this.reportsService.getAllReports();
            res.status(200).json(reports);
        } catch (error) {
            next(error);
        }
    };

    public getReportById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
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
        } catch (error) {
            next(error);
        }
    };

    public replyToReport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
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
        } catch (error) {
            next(error);
        }
    };
}
