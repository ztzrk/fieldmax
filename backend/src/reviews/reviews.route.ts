import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export class ReviewsRoute {
    public path = "/reviews";
    public router = Router();
    public controller = new ReviewsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            authMiddleware,
            this.controller.create
        );
        this.router.get(
            `${this.path}/fields/:fieldId`,
            this.controller.getByFieldId
        );
    }
}
