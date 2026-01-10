import { Request, Response } from "express";
import { RenterService } from "./renter.service";
import { asyncHandler } from "../utils/asyncHandler";

export class RenterController {
    constructor(private service: RenterService) {}

    public getMyVenues = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const data = await this.service.findMyVenues(renterId);
        res.status(200).json({ data });
    });

    public getMyVenueById = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const venueId = req.params.id;
            const data = await this.service.findMyVenueById(renterId, venueId);
            if (!data) {
                res.status(404).json({ message: "Venue not found" });
            }
            res.status(200).json({ data });
        }
    );

    public getMyBookings = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const data = await this.service.findMyBookings(renterId);
        res.status(200).json({ data });
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
                res.status(404).json({ message: "Booking not found" });
            }
            res.status(200).json({ data });
        }
    );

    public confirmBooking = asyncHandler(
        async (req: Request, res: Response) => {
            const bookingId = req.params.id;
            const data = await this.service.confirmBooking(bookingId);
            res.status(200).json({ data });
        }
    );

    public cancelBooking = asyncHandler(async (req: Request, res: Response) => {
        const bookingId = req.params.id;
        const data = await this.service.cancelBooking(bookingId);
        res.status(200).json({ data });
    });

    public completeBooking = asyncHandler(
        async (req: Request, res: Response) => {
            const bookingId = req.params.id;
            const data = await this.service.completeBooking(bookingId);
            res.status(200).json({ data });
        }
    );

    public getMyFields = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const data = await this.service.findMyFields(renterId);
        res.status(200).json({ data });
    });

    public getMyFieldById = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const fieldId = req.params.id;
            const data = await this.service.findMyFieldById(renterId, fieldId);
            if (!data) {
                res.status(404).json({ message: "Field not found" });
            }
            res.status(200).json({ data });
        }
    );

    public countMyBookings = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const count = await this.service.countMyBookings(renterId);
            res.status(200).json({ count });
        }
    );

    public countMyFields = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const count = await this.service.countMyFields(renterId);
        res.status(200).json({ count });
    });

    public countMyVenues = asyncHandler(async (req: Request, res: Response) => {
        const renterId = req.user!.id;
        const count = await this.service.countMyVenues(renterId);
        res.status(200).json({ count });
    });

    public getMyVenuesWithPagination = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const data = await this.service.findMyVenuesWithPagination(
                renterId,
                req.query
            );
            res.status(200).json({ data });
        }
    );

    public getMyFieldsWithPagination = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const data = await this.service.findMyFieldsWithPagination(
                renterId,
                req.query
            );
            res.status(200).json({ data });
        }
    );

    public getMyBookingsWithPagination = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const data = await this.service.findMyBookingsWithPagination(
                renterId,
                req.query
            );
            res.status(200).json({ data });
        }
    );

    public getRevenueStats = asyncHandler(
        async (req: Request, res: Response) => {
            const renterId = req.user!.id;
            const data = await this.service.getRevenueStats(renterId);
            res.status(200).json({ data });
        }
    );
}
