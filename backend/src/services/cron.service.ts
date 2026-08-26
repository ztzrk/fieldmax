import cron from "node-cron";
import prisma from "../db";
import { logger } from "../utils/logger";

export class CronService {
    public static init() {
        // Run every 15 minutes
        cron.schedule("*/15 * * * *", async () => {
            try {
                const now = new Date();

                // 1. Auto-complete past confirmed bookings
                const confirmedBookings = await prisma.booking.findMany({
                    where: {
                        status: "CONFIRMED",
                        bookingDate: {
                            lte: now,
                        },
                    },
                    select: {
                        id: true,
                        bookingDate: true,
                        endTime: true,
                    },
                });

                const completedBookingIds: string[] = [];

                for (const booking of confirmedBookings) {
                    const bookingDateStr = booking.bookingDate
                        .toISOString()
                        .split("T")[0];
                    const hours = booking.endTime
                        .getUTCHours()
                        .toString()
                        .padStart(2, "0");
                    const minutes = booking.endTime
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, "0");
                    const endDateTime = new Date(
                        `${bookingDateStr}T${hours}:${minutes}:00.000+07:00`
                    );

                    if (endDateTime <= now) {
                        completedBookingIds.push(booking.id);
                    }
                }

                if (completedBookingIds.length > 0) {
                    const result = await prisma.booking.updateMany({
                        where: {
                            id: { in: completedBookingIds },
                        },
                        data: {
                            status: "COMPLETED",
                        },
                    });
                    logger.info(
                        `[Cron] Auto-completed ${result.count} bookings.`
                    );
                }

                // 2. Auto-cancel stale pending bookings older than 30 minutes
                const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
                const stalePendingBookings = await prisma.booking.findMany({
                    where: {
                        status: "PENDING",
                        createdAt: {
                            lt: thirtyMinutesAgo,
                        },
                    },
                    select: { id: true },
                });

                if (stalePendingBookings.length > 0) {
                    const staleIds = stalePendingBookings.map((b) => b.id);
                    await prisma.$transaction([
                        prisma.booking.updateMany({
                            where: { id: { in: staleIds } },
                            data: { status: "CANCELLED" },
                        }),
                        prisma.payment.updateMany({
                            where: { bookingId: { in: staleIds }, status: "PENDING" },
                            data: { status: "EXPIRED" },
                        }),
                    ]);
                    logger.info(
                        `[Cron] Expired ${staleIds.length} stale pending bookings.`
                    );
                }
            } catch (error) {
                logger.error("Error running booking cron jobs: " + error);
            }
        });
    }
}
