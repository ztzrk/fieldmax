import { NextFunction, Request, Response } from "express";
import { BookingsService } from "./bookings.service";
import { CreateBooking } from "../schemas/bookings.schema";
import { asyncHandler } from "../utils/asyncHandler";

export class BookingsController {
    constructor(private service: BookingsService) {}

    public findAll = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query;
        const data = await this.service.findAllBookings(query, req.user!);
        res.status(200).json(data);
    });

    public findOne = asyncHandler(async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        const data = await this.service.findBookingById(bookingId);
        res.status(200).json(data);
    });

    public create = asyncHandler(async (req: Request, res: Response) => {
        const bookingData: CreateBooking = req.body;
        const user = req.user!;
        const data = await this.service.createBooking(bookingData, user);
        res.status(201).json({
            data,
            message: "Booking created, awaiting payment.",
        });
    });

    public confirmBooking = asyncHandler(
        async (req: Request, res: Response) => {
            const { bookingId } = req.params;
            const data = await this.service.confirmBooking(bookingId);
            res.status(200).json({
                data,
                message: "Booking confirmed.",
            });
        }
    );

    public cancelBooking = asyncHandler(async (req: Request, res: Response) => {
        const { bookingId } = req.params;
        const data = await this.service.cancelBooking(bookingId);
        res.status(200).json({
            data,
            message: "Booking canceled.",
        });
    });
}
