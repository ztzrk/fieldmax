import { Router } from "express";
import { FieldsController } from "./fields.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
    createFieldSchema,
    rejectFieldSchema,
    updateFieldSchema,
    toggleFieldClosureSchema,
    scheduleOverrideSchema,
    getAvailabilitySchema,
} from "../schemas/fields.schema";
import { canManageField } from "../middleware/permission.middleware";
import { paginationSchema } from "../schemas/pagination.schema";
import { optionalAuthMiddleware } from "../middleware/optionalAuth.middleware";

export class FieldsRoute {
    public path = "/fields";
    public router = Router();
    public controller = new FieldsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            optionalAuthMiddleware,
            validationMiddleware(paginationSchema, true),
            this.controller.getAll
        );
        this.router.get(`${this.path}/:id`, this.controller.getById);
        this.router.post(
            `${this.path}`,
            authMiddleware,
            canManageField,
            validationMiddleware(createFieldSchema),
            this.controller.create
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            canManageField,
            validationMiddleware(updateFieldSchema, true),
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
            validationMiddleware(rejectFieldSchema),
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
            validationMiddleware(toggleFieldClosureSchema),
            this.controller.toggleClosure
        );

        this.router.get(
            `${this.path}/:fieldId/overrides`,
            authMiddleware,
            canManageField,
            this.controller.getOverrides
        );

        this.router.post(
            `${this.path}/:fieldId/overrides`,
            authMiddleware,
            canManageField,
            validationMiddleware(scheduleOverrideSchema),
            this.controller.createOverride
        );

        this.router.delete(
            `${this.path}/:fieldId/overrides/:overrideId`,
            authMiddleware,
            canManageField,
            this.controller.deleteOverride
        );

        this.router.delete(
            `${this.path}/photos/:photoId`,
            authMiddleware,
            canManageField,
            this.controller.deletePhoto
        );
        this.router.get(
            `${this.path}/:fieldId/availability`,
            validationMiddleware(getAvailabilitySchema, true),
            this.controller.getAvailability
        );
    }
}
