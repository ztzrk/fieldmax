import cron from "node-cron";
import prisma from "../db";

export class CronService {
    public static init() {
        // Run every minute
        cron.schedule("* * * * *", async () => {
            console.log("Running booking completion check...");
            try {
                const now = new Date();

                // Update bookings that are CONFIRMED and endTime < now to COMPLETED
                const result = await prisma.booking.updateMany({
                    where: {
                        status: "CONFIRMED",
                        endTime: {
                            lt: now,
                        },
                    },
                    data: {
                        status: "COMPLETED",
                    },
                });

                if (result.count > 0) {
                    console.log(`Auto-completed ${result.count} bookings.`);
                }
            } catch (error) {
                console.error("Error running booking completion cron:", error);
            }
        });
    }
}
