import { Request, Response } from "express";
import { PaymentsService } from "./payments.service";
import { config } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";

export class PaymentsController {
    constructor(private service: PaymentsService) {}

    public handleNotification = asyncHandler(
        async (req: Request, res: Response) => {
            const notificationJson = req.body;
            await this.service.handleMidtransNotification(notificationJson);
            res.status(200).json({
                message: "Notification received successfully.",
            });
        }
    );

    public handleRedirect = asyncHandler(
        async (req: Request, res: Response) => {
            // Redirect to frontend profile page
            const redirectUrl = `${config.FRONTEND_URL}/bookings`;
            res.redirect(redirectUrl);
        }
    );
}
