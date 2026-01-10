import { Request, Response } from "express";
import { PaymentsService } from "./payments.service";
import { config } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class PaymentsController {
    constructor(private service: PaymentsService) {}

    public handleNotification = asyncHandler(
        async (req: Request, res: Response) => {
            const notificationJson = req.body;
            await this.service.handleMidtransNotification(notificationJson);
            sendSuccess(res, null, "Notification received successfully.");
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
