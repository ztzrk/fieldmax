
import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";

export class DashboardRoute {
  public router: Router;
  private controller: DashboardController;

  constructor() {
    this.router = Router();
    this.controller = new DashboardController();
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
  }
}
