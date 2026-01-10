import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
    createReviewSchema,
    getReviewsQuerySchema,
} from "../schemas/reviews.schema";
import { z } from "zod";

export class ReviewsRoute {
    public path = "/reviews";
    public router = Router();

    constructor(private controller: ReviewsController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}`,
            authMiddleware,
            validateRequest(createReviewSchema),
            this.controller.create
        );
        this.router.get(
            `${this.path}/fields/:fieldId`,
            validateRequest(z.object({ query: getReviewsQuerySchema })),
            this.controller.getByFieldId
        );
    }
}
