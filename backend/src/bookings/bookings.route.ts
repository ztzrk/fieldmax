import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { z } from "zod";
import {
    bookingQuerySchema,
    createBookingSchema,
} from "../schemas/bookings.schema";

export class BookingsRoute {
    public path = "/bookings";
    public router = Router();

    constructor(private controller: BookingsController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            authMiddleware,
            validateRequest(z.object({ query: bookingQuerySchema })),
            this.controller.findAll
        );
        this.router.get(
            `${this.path}/:bookingId`,
            authMiddleware,
            this.controller.findOne
        );
        this.router.post(
            `${this.path}`,
            authMiddleware,
            validateRequest(z.object({ body: createBookingSchema })),
            this.controller.create
        );
        this.router.post(
            `${this.path}/:bookingId/confirm`,
            authMiddleware,
            adminOnlyMiddleware,
            this.controller.confirmBooking
        );
        this.router.post(
            `${this.path}/:bookingId/cancel`,
            authMiddleware,
            this.controller.cancelBooking
        );
    }
}
