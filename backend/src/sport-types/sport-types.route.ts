import { Router, Response, NextFunction, Request } from "express";
import { SportTypesController } from "./sport-types.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
    createSportTypeSchema,
    updateSportTypeSchema,
} from "../schemas/sport-types.schema";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { paginationSchema } from "../schemas/pagination.schema";

export class SportTypesRoute {
    public path = "/sport-types";
    public router = Router();

    constructor(private controller: SportTypesController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            validationMiddleware(paginationSchema, true),
            this.controller.getAll
        );

        this.router.post(
            `${this.path}`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(createSportTypeSchema),
            this.controller.create
        );

        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(updateSportTypeSchema),
            this.controller.update
        );

        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.delete
        );
        this.router.post(
            `${this.path}/multiple`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.deleteMultiple
        );
    }
}
