import prisma from "../db";
import midtransclient from "midtrans-client";
import { BookingsService } from "../bookings/bookings.service";

export class PaymentsService {
    private snap = new midtransclient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    private bookingsService = new BookingsService();

    public async handleMidtransNotification(notification: any) {
        const statusResponse = await this.snap.transaction.notification(
            notification
        );
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(`Processing Order ID: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

        const booking = await prisma.booking.findUnique({
            where: { id: orderId },
        });
        if (!booking) return;

        if (
            transactionStatus == "capture" ||
            transactionStatus == "settlement"
        ) {
            if (fraudStatus == "accept") {
                await this.bookingsService.updateStatus(orderId, "CONFIRMED", "PAID");
            }
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny"
        ) {
            await this.bookingsService.updateStatus(orderId, "CANCELLED", "FAILED");
        } else if (transactionStatus == "expire") {
            await this.bookingsService.updateStatus(orderId, "CANCELLED", "EXPIRED");
        } else if (transactionStatus == "pending") {
            await this.bookingsService.updateStatus(orderId, "PENDING", "PENDING");
        }
    }
}
