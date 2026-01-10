import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { z } from "zod";

export class DashboardRoute {
    public router: Router;

    constructor(private controller: DashboardController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            "/dashboard/admin-stats",
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.getAdminStats
        );

        this.router.get(
            "/dashboard/renter-stats",
            authMiddleware,
            this.controller.getRenterStats
        );

        this.router.get(
            "/dashboard/chart-data",
            authMiddleware,
            validateRequest(
                z.object({
                    query: z.object({
                        range: z
                            .enum(["7d", "30d", "12m"])
                            .optional()
                            .default("7d"),
                    }),
                })
            ),
            this.controller.getChartData
        );
    }
}
