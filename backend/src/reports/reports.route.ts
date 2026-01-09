import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";

export class ReportsRoute {
    public router = Router();
    private reportsController = new ReportsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // User reports routes

        // POST /reports - Create a report
        this.router.post(
            "/reports",
            authMiddleware,
            this.reportsController.createReport
        );

        // GET /reports/my - Get my reports
        this.router.get(
            "/reports/my",
            authMiddleware,
            this.reportsController.getMyReports
        );

        // GET /reports/:id - Get specific report (User: own, Admin: any)
        this.router.get(
            "/reports/:id",
            authMiddleware,
            this.reportsController.getReportById
        );

        // POST /reports/:id/reply - Reply to report
        this.router.post(
            "/reports/:id/reply",
            authMiddleware,
            this.reportsController.replyToReport
        );

        // Admin routes
        // GET /admin/reports - Get all reports
        this.router.get(
            "/admin/reports",
            authMiddleware,
            adminOnlyMiddleware,
            this.reportsController.getAllReports
        );
    }
}
