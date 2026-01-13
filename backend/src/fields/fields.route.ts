import { Router } from "express";
import { FieldsController } from "./fields.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { z } from "zod";
import {
    createFieldSchema,
    rejectFieldSchema,
    updateFieldSchema,
    toggleFieldClosureSchema,
    getAvailabilitySchema,
} from "../schemas/fields.schema";
import { canManageField } from "../middleware/permission.middleware";
import { paginationSchema } from "../schemas/pagination.schema";
import { optionalAuthMiddleware } from "../middleware/optionalAuth.middleware";

export class FieldsRoute {
    public path = "/fields";
    public router = Router();

    constructor(private controller: FieldsController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            optionalAuthMiddleware,
            validateRequest(z.object({ query: paginationSchema })),
            this.controller.getAll
        );
        this.router.get(`${this.path}/:id`, this.controller.getById);
        this.router.post(
            `${this.path}`,
            authMiddleware,
            canManageField,
            validateRequest(z.object({ body: createFieldSchema })),
            this.controller.create
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            canManageField,
            validateRequest(z.object({ body: updateFieldSchema })),
            this.controller.update
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            canManageField,
            this.controller.delete
        );
        this.router.post(
            `${this.path}/multiple`,
            authMiddleware,
            canManageField,
            // Manual validation often ok here or add schema
            this.controller.deleteMultiple
        );
        this.router.patch(
            `${this.path}/:id/approve`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.approve
        );

        this.router.patch(
            `${this.path}/:id/reject`,
            authMiddleware,
            adminOnlyMiddleware,
            validateRequest(z.object({ body: rejectFieldSchema })),
            this.controller.reject
        );

        this.router.patch(
            `${this.path}/:id/resubmit`,
            authMiddleware,
            canManageField,
            this.controller.resubmit
        );

        this.router.patch(
            `${this.path}/:id/closure`,
            authMiddleware,
            canManageField,
            validateRequest(z.object({ body: toggleFieldClosureSchema })),
            this.controller.toggleClosure
        );

        this.router.delete(
            `${this.path}/photos/:photoId`,
            authMiddleware,
            canManageField,
            this.controller.deletePhoto
        );
        this.router.get(
            `${this.path}/:fieldId/availability`,
            validateRequest(z.object({ query: getAvailabilitySchema })),
            this.controller.getAvailability
        );
    }
}
