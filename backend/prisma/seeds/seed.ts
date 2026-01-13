import { PrismaClient } from "@prisma/client";
import { seedSimulation } from "./simulation";
// import { seedUsers } from "./users";
// import { seedSportTypes } from "./sport-types";
// import { seedVenues } from "./venues";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 STARTING SEED PROCESS...");

    try {
        await prisma.$connect();

        // Use the new Unified Simulation Seeder
        // Defaulting to "MEDIUM" which is good balance of data (~5-10k bookings, 30 renters)
        await seedSimulation("LARGE");

        /* OLD SEED - kept for reference
        // 1. Users
        await seedUsers(prisma);

        // 2. Sport Types
        await seedSportTypes(prisma);

        // 3. Venues & Fields
        await seedVenues(prisma);
        */

        console.log("✅ ALL SEEDS COMPLETED SUCCESSFULLY");
    } catch (e) {
        console.error("❌ SEEDING FAILED:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
