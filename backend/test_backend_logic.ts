import { PrismaClient } from "@prisma/client";
import { RenterService } from "./src/renter/renter.service";
import { DashboardService } from "./src/dashboard/dashboard.service";

const prisma = new PrismaClient();
const renterService = new RenterService();
const dashboardService = new DashboardService();

async function main() {
    console.log("Fetching a Renter...");
    const renter = await prisma.user.findFirst({
        where: { role: "RENTER" },
    });

    try {
        await prisma.user.updateMany({
            where: { email: "testuser6@example.com" },
            data: { isVerified: true },
        });
        console.log("Verified testuser6@example.com");
    } catch (e) {
        console.error("Failed to verify testuser6", e);
    }

    if (!renter) {
        console.log("No renter found. Cannot test.");
        return;
    }

    console.log(`Testing with Renter: ${renter.email} (${renter.id})`);

    try {
        console.log("--- Testing RenterService.getRevenueStats ---");
        const revenueStats = await renterService.getRevenueStats(renter.id);
        console.log("Revenue Stats success!");
        console.log(JSON.stringify(revenueStats, null, 2));
    } catch (e) {
        console.error("RenterService failed:", e);
    }

    try {
        console.log("--- Testing DashboardService.getChartData (7d) ---");
        const chartData = await dashboardService.getChartData(
            "RENTER",
            renter.id,
            "7d"
        );
        console.log("Dashboard Chart Data success!");
        console.log(JSON.stringify(chartData, null, 2));
    } catch (e) {
        console.error("DashboardService failed:", e);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
