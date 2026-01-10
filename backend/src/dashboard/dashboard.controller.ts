import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { asyncHandler } from "../utils/asyncHandler";

export class DashboardController {
    constructor(private service: DashboardService) {}

    getAdminStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await this.service.getAdminStats();
        res.status(200).json(stats);
    });

    getRenterStats = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user?.id;
        if (!renterId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const stats = await this.service.getRenterStats(renterId);
        res.status(200).json(stats);
    });

    getChartData = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user;
        const { range } = req.query;

        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const validRanges = ["7d", "30d", "12m"];
        const selectedRange = validRanges.includes(range as string)
            ? (range as "7d" | "30d" | "12m")
            : "7d";

        // Admin sees all, Renter sees own
        const role = user.role;
        const data = await this.service.getChartData(
            role,
            user.id,
            selectedRange
        );
        res.status(200).json(data);
    });
}
