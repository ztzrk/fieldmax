// src/bookings/bookings.route.ts
import { Router } from "express";
import { BookingsController } from "./bookings.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { z } from "zod";
import { createBookingSchema } from "../schemas/bookings.schema";
import { paginationSchema } from "../schemas/pagination.schema";

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
            validateRequest(z.object({ query: paginationSchema })),
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
            this.controller.confirmBooking
        );
        this.router.post(
            `${this.path}/:bookingId/cancel`,
            authMiddleware,
            this.controller.cancelBooking
        );
    }
}
