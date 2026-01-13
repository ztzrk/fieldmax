import { NextFunction, Request, Response } from "express";
import { BookingsService } from "./bookings.service";
import { CreateBooking } from "../schemas/bookings.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class BookingsController {
    constructor(private service: BookingsService) {}

    public findAll = asyncHandler(async (req: Request, res: Response) => {
        const query =
            req.query as unknown as import("../schemas/pagination.schema").Pagination;
        const result = await this.service.findAllBookings(query, req.user!);
        sendSuccess(res, result.data, "Bookings retrieved", 200, result.meta);
    });

    public findOne = asyncHandler(async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        const data = await this.service.findBookingById(bookingId);
        sendSuccess(res, data, "Booking details retrieved");
    });

    public create = asyncHandler(async (req: Request, res: Response) => {
        const bookingData: CreateBooking = req.body;
        const user = req.user!;
        const data = await this.service.createBooking(bookingData, user);
        sendSuccess(res, data, "Booking created, awaiting payment.", 201);
    });

    public confirmBooking = asyncHandler(
        async (req: Request, res: Response) => {
            const { bookingId } = req.params;
            const data = await this.service.confirmBooking(bookingId);
            sendSuccess(res, data, "Booking confirmed.");
        }
    );

    public cancelBooking = asyncHandler(async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        const data = await this.service.cancelBooking(bookingId);
        sendSuccess(res, data, "Booking canceled.");
    });
}
