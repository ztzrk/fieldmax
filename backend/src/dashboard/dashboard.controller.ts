import { Request, Response, NextFunction } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
    private service: DashboardService;

    constructor() {
        this.service = new DashboardService();
    }

    getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await this.service.getAdminStats();
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    };

    getRenterStats = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const renterId = req.user?.id;
            if (!renterId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const stats = await this.service.getRenterStats(renterId);
            res.status(200).json(stats);
        } catch (error) {
            next(error);
        }
    };
    getChartData = async (req: Request, res: Response, next: NextFunction) => {
        try {
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
        } catch (error) {
            next(error);
        }
    };
}
