import { Request, Response } from "express";
import { RenterService } from "./renter.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";

export class RenterController {
    constructor(private service: RenterService) {}

    public getMyVenues = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const data = await this.service.findMyVenues(renterId);
        sendSuccess(res, data, "Venues retrieved");
    });

    public getMyVenueById = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const venueId = req.params.id;
            const data = await this.service.findMyVenueById(renterId, venueId);
            if (!data) {
                return sendError(res, "Venue not found", "NOT_FOUND", 404);
            }
            sendSuccess(res, data, "Venue details retrieved");
        }
    );

    public getMyBookings = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const data = await this.service.findMyBookings(renterId);
        sendSuccess(res, data, "Bookings retrieved");
    });

    public getMyBookingById = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const bookingId = req.params.id;
            const data = await this.service.findMyBookingById(
                renterId,
                bookingId
            );
            if (!data) {
                return sendError(res, "Booking not found", "NOT_FOUND", 404);
            }
            sendSuccess(res, data, "Booking details retrieved");
        }
    );

    public confirmBooking = asyncHandler(
        async (req: Request, res: Response) => {
            const bookingId = req.params.id;
            const data = await this.service.confirmBooking(bookingId);
            sendSuccess(res, data, "Booking confirmed");
        }
    );

    public cancelBooking = asyncHandler(async (req: Request, res: Response) => {
        const bookingId = req.params.id;
        const data = await this.service.cancelBooking(bookingId);
        sendSuccess(res, data, "Booking cancelled");
    });

    public completeBooking = asyncHandler(
        async (req: Request, res: Response) => {
            const bookingId = req.params.id;
            const data = await this.service.completeBooking(bookingId);
            sendSuccess(res, data, "Booking completed");
        }
    );

    public getMyFields = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const data = await this.service.findMyFields(renterId);
        sendSuccess(res, data, "Fields retrieved");
    });

    public getMyFieldById = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const fieldId = req.params.id;
            const data = await this.service.findMyFieldById(renterId, fieldId);
            if (!data) {
                return sendError(res, "Field not found", "NOT_FOUND", 404);
            }
            sendSuccess(res, data, "Field details retrieved");
        }
    );

    public countMyBookings = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const count = await this.service.countMyBookings(renterId);
            sendSuccess(res, { count }, "Booking count retrieved");
        }
    );

    public countMyFields = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const count = await this.service.countMyFields(renterId);
        sendSuccess(res, { count }, "Field count retrieved");
    });

    public countMyVenues = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const count = await this.service.countMyVenues(renterId);
        sendSuccess(res, { count }, "Venue count retrieved");
    });

    public getMyVenuesWithPagination = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const result = await this.service.findMyVenuesWithPagination(
                renterId,
                req.query
            );
            sendSuccess(res, result.data, "Venues retrieved", 200, result.meta);
        }
    );

    public getMyFieldsWithPagination = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const result = await this.service.findMyFieldsWithPagination(
                renterId,
                req.query
            );
            sendSuccess(res, result.data, "Fields retrieved", 200, result.meta);
        }
    );

    public getMyBookingsWithPagination = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const result = await this.service.findMyBookingsWithPagination(
                renterId,
                req.query
            );
            sendSuccess(
                res,
                result.data,
                "Bookings retrieved",
                200,
                result.meta
            );
        }
    );

    public getRevenueStats = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const data = await this.service.getRevenueStats(renterId);
            sendSuccess(res, data, "Revenue stats retrieved");
        }
    );
}
