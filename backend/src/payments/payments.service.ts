import prisma from "../db";
import { BookingsService } from "../bookings/bookings.service";

export class PaymentsService {
    private bookingsService: BookingsService;

    constructor(bookingsService: BookingsService) {
        this.bookingsService = bookingsService;
    }

    public async handleMidtransNotification(notification: any) {
        const orderId = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        const booking = await prisma.booking.findUnique({
            where: { id: orderId },
        });
        if (!booking) return;

        if (
            transactionStatus == "capture" ||
            transactionStatus == "settlement"
        ) {
            if (fraudStatus == "accept") {
                await this.bookingsService.updateStatus(
                    orderId,
                    "CONFIRMED",
                    "PAID"
                );
            }
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny"
        ) {
            await this.bookingsService.updateStatus(
                orderId,
                "CANCELLED",
                "FAILED"
            );
        } else if (transactionStatus == "expire") {
            await this.bookingsService.updateStatus(
                orderId,
                "CANCELLED",
                "EXPIRED"
            );
        } else if (transactionStatus == "pending") {
            await this.bookingsService.updateStatus(
                orderId,
                "PENDING",
                "PENDING"
            );
        }
    }
}
