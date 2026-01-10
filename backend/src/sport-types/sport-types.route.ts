import { Router } from "express";
import { SportTypesController } from "./sport-types.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
    createSportTypeSchema,
    updateSportTypeSchema,
    deleteMultipleSportTypesSchema,
} from "../schemas/sport-types.schema";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { paginationSchema } from "../schemas/pagination.schema";
import { z } from "zod";

export class SportTypesRoute {
    public path = "/sport-types";
    public router = Router();

    constructor(private controller: SportTypesController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            validateRequest(z.object({ query: paginationSchema })),
            this.controller.getAll
        );

        this.router.post(
            `${this.path}`,
            authMiddleware,
            adminOnlyMiddleware,
            validateRequest(z.object({ body: createSportTypeSchema })),
            this.controller.create
        );

        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            adminOnlyMiddleware,
            validateRequest(z.object({ body: updateSportTypeSchema })),
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
            validateRequest(z.object({ body: deleteMultipleSportTypesSchema })),
            this.controller.deleteMultiple
        );
    }
}
