import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";

export class DashboardController {
    constructor(private service: DashboardService) {}

    getAdminStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await this.service.getAdminStats();
        sendSuccess(res, stats, "Admin stats retrieved");
    });

    getRenterStats = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user?.id;
        if (!renterId) {
            return sendError(res, "Unauthorized", "UNAUTHORIZED", 401);
        }
        const stats = await this.service.getRenterStats(renterId);
        sendSuccess(res, stats, "Renter stats retrieved");
    });

    getChartData = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        const { range } = req.query;

        if (!user) {
            return sendError(res, "Unauthorized", "UNAUTHORIZED", 401);
        }

        // range validation is now handled by middleware, so we can cast safely
        const selectedRange = range as "7d" | "30d" | "12m";

        // Admin sees all, Renter sees own
        const role = user.role;
        const data = await this.service.getChartData(
            role,
            user.id,
            selectedRange
        );
        sendSuccess(res, data, "Chart data retrieved");
    });
}
