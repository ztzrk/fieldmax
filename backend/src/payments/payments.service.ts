import crypto from "crypto";
import prisma from "../db";
import { BookingsService } from "../bookings/bookings.service";
import { config } from "../config/env";
import { UnauthorizedError } from "../utils/errors";
import { logger } from "../utils/logger";

export class PaymentsService {
    private bookingsService: BookingsService;

    constructor(bookingsService: BookingsService) {
        this.bookingsService = bookingsService;
    }

    public async handleMidtransNotification(notification: any) {
        const orderId = notification.order_id;
        const statusCode = notification.status_code;
        const grossAmount = notification.gross_amount;
        const signatureKey = notification.signature_key;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        // Verify Midtrans SHA-512 signature key
        if (signatureKey) {
            const hash = crypto
                .createHash("sha512")
                .update(
                    `${orderId}${statusCode}${grossAmount}${config.MIDTRANS_SERVER_KEY}`
                )
                .digest("hex");

            if (hash !== signatureKey) {
                logger.warn(
                    `[Payment Notification] Invalid signature for order ${orderId}`
                );
                throw new UnauthorizedError("Invalid Midtrans signature.");
            }
        }

        const booking = await prisma.booking.findUnique({
            where: { id: orderId },
        });
        if (!booking) {
            logger.warn(
                `[Payment Notification] Booking not found for order ${orderId}`
            );
            return;
        }

        if (transactionStatus === "settlement") {
            await this.bookingsService.updateStatus(
                orderId,
                "CONFIRMED",
                "PAID"
            );
        } else if (transactionStatus === "capture") {
            if (fraudStatus === "accept") {
                await this.bookingsService.updateStatus(
                    orderId,
                    "CONFIRMED",
                    "PAID"
                );
            } else if (fraudStatus === "challenge") {
                logger.warn(
                    `[Payment Notification] Payment challenged for order ${orderId}`
                );
            }
        } else if (
            transactionStatus === "cancel" ||
            transactionStatus === "deny"
        ) {
            await this.bookingsService.updateStatus(
                orderId,
                "CANCELLED",
                "FAILED"
            );
        } else if (transactionStatus === "expire") {
            await this.bookingsService.updateStatus(
                orderId,
                "CANCELLED",
                "EXPIRED"
            );
        } else if (transactionStatus === "pending") {
            await this.bookingsService.updateStatus(
                orderId,
                "PENDING",
                "PENDING"
            );
        }
    }
}
