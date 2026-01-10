import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";

export class ReportsRoute {
    public router = Router();

    constructor(private reportsController: ReportsController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            "/reports",
            authMiddleware,
            this.reportsController.createReport
        );

        this.router.get(
            "/reports/my",
            authMiddleware,
            this.reportsController.getMyReports
        );

        this.router.get(
            "/reports/:id",
            authMiddleware,
            this.reportsController.getReportById
        );

        this.router.post(
            "/reports/:id/reply",
            authMiddleware,
            this.reportsController.replyToReport
        );

        this.router.get(
            "/admin/reports",
            authMiddleware,
            adminOnlyMiddleware,
            this.reportsController.getAllReports
        );
    }
}
