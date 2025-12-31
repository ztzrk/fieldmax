import { NextFunction, Request, Response } from "express";
import { PaymentsService } from "./payments.service";

export class PaymentsController {
    public service = new PaymentsService();

    public handleNotification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const notificationJson = req.body;
            await this.service.handleMidtransNotification(notificationJson);
            res.status(200).json({
                message: "Notification received successfully.",
            });
        } catch (error) {
            next(error);
        }
    };

    public handleRedirect = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            // Redirect to frontend profile page
            const redirectUrl = `${
                process.env.FRONTEND_URL || "http://localhost:3001"
            }/bookings`;
            res.redirect(redirectUrl);
        } catch (error) {
            next(error);
        }
    };
}
