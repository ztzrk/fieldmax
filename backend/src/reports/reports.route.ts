import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { CreateReportSchema, CreateReplySchema } from "./reports.schema";
import { z } from "zod";

export class ReportsRoute {
    public router = Router();

    constructor(private reportsController: ReportsController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            "/reports",
            authMiddleware,
            validateRequest(z.object({ body: CreateReportSchema })),
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
            validateRequest(z.object({ body: CreateReplySchema })),
            this.reportsController.replyToReport
        );

        this.router.get(
            "/admin/reports",
            authMiddleware,
            adminOnlyMiddleware,
            this.reportsController.getAllReports
        );

        this.router.patch(
            "/admin/reports/:id/resolve",
            authMiddleware,
            adminOnlyMiddleware,
            this.reportsController.resolveReport
        );
    }
}
