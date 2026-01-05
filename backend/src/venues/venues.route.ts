// src/venues/venues.route.ts
import { Router } from "express";
import { VenuesController } from "./venues.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
    createVenueSchema,
    rejectVenueSchema,
    updateVenueSchema,
} from "../schemas/venues.schema";
import {
    canManageVenue,
    isVenueOwner,
} from "../middleware/permission.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { paginationSchema } from "../schemas/pagination.schema";

export class VenuesRoute {
    public path = "/venues";
    public router = Router();
    public controller = new VenuesController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/public`, this.controller.getAll);

        this.router.get(`${this.path}/public/:id`, this.controller.getById);

        this.router.get(
            `${this.path}`,
            authMiddleware,
            validationMiddleware(paginationSchema, true),
            this.controller.getAll
        );

        this.router.get(
            `${this.path}/list`,
            authMiddleware,
            this.controller.getList
        );

        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            this.controller.getById
        );

        this.router.post(
            `${this.path}`,
            authMiddleware,
            validationMiddleware(createVenueSchema),
            this.controller.create
        );

        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            canManageVenue,
            validationMiddleware(updateVenueSchema, true),
            this.controller.update
        );

        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            canManageVenue,
            this.controller.delete
        );

        this.router.post(
            `${this.path}/multiple`,
            authMiddleware,
            canManageVenue,
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
            validationMiddleware(rejectVenueSchema),
            this.controller.reject
        );

        this.router.patch(
            `${this.path}/:id/resubmit`,
            authMiddleware,
            isVenueOwner,
            this.controller.resubmit
        );

        this.router.patch(
            `${this.path}/:id/submit`,
            authMiddleware,
            isVenueOwner,
            this.controller.submit
        );

        this.router.delete(
            `${this.path}/photos/:photoId`,
            authMiddleware,
            canManageVenue,
            this.controller.deletePhoto
        );
    }
}
