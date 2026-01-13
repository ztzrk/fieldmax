import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting large scale seeding...");
    const startTime = Date.now();

    // 1. Prepare common data
    const hashedPassword = await bcrypt.hash("password", 10);
    const sportTypes = await prisma.sportType.findMany();

    if (sportTypes.length === 0) {
        console.error(
            "No sport types found! Please run seed_sport_types.ts first."
        );
        return;
    }

    // 2. Create Renters (100)
    console.log("Seeding 100 Renters...");
    const rentersData = Array.from({ length: 100 }).map((_, i) => ({
        email: `renter${i + 1}_${Date.now()}@example.com`, // Ensure uniqueness
        fullName: `Renter ${i + 1}`,
        password: hashedPassword,
        role: "RENTER" as UserRole,
        isVerified: true,
    }));

    // Use createMany for users
    await prisma.user.createMany({
        data: rentersData,
    });

    // Fetch them back to get IDs for venue association
    const createdRenters = await prisma.user.findMany({
        where: {
            email: { in: rentersData.map((r) => r.email) },
        },
        select: { id: true },
    });
    console.log(`Created ${createdRenters.length} renters.`);

    // 3. Create Users (300)
    console.log("Seeding 300 Users...");
    const usersData = Array.from({ length: 300 }).map((_, i) => ({
        email: `user${i + 1}_${Date.now()}@example.com`,
        fullName: `User ${i + 1}`,
        password: hashedPassword,
        role: "USER" as UserRole,
        isVerified: true,
    }));

    await prisma.user.createMany({
        data: usersData,
    });
    console.log("Created 300 users.");

    // 4. Create Venues (200) with 3-5 fields each
    console.log("Seeding 200 Venues with Fields...");

    const venueProms = [];
    const chunkSize = 10; // Process in chunks to avoid overwhelming the DB connection

    for (let i = 0; i < 200; i++) {
        // Round-robin assignment of renters
        const renterId = createdRenters[i % createdRenters.length].id;
        const venueNum = i + 1;

        // Random number of fields between 3 and 5
        const numFields = Math.floor(Math.random() * 3) + 3;

        // Generate Fields Data
        const fieldsData = Array.from({ length: numFields }).map(
            (_, fIndex) => {
                const sport =
                    sportTypes[Math.floor(Math.random() * sportTypes.length)];
                return {
                    name: `Venue ${venueNum} Field ${fIndex + 1}`,
                    description: `High quality ${sport.name} field for Venue ${venueNum}.`,
                    pricePerHour:
                        50000 + Math.floor(Math.random() * 10) * 10000, // Random price 50k-150k
                    sportTypeId: sport.id,
                    status: "APPROVED" as const,
                    photos: {
                        create: [
                            {
                                url: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            },
                            {
                                url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                            },
                        ],
                    },
                };
            }
        );

        // Create Venue with Fields and Schedule
        const venuePromise = prisma.venue.create({
            data: {
                name: `Seeded Venue ${venueNum}`,
                address: `Jl. Seeded Address No. ${venueNum}`,
                city: "Jakarta",
                district: "South Jakarta",
                province: "DKI Jakarta",
                postalCode: "12345",
                description: `This is seeded venue number ${venueNum}.`,
                renterId: renterId,
                status: "APPROVED",
                schedules: {
                    create: [
                        {
                            dayOfWeek: 0,
                            openTime: new Date("1970-01-01T08:00:00Z"),
                            closeTime: new Date("1970-01-01T22:00:00Z"),
                        },
                        {
                            dayOfWeek: 1,
                            openTime: new Date("1970-01-01T08:00:00Z"),
                            closeTime: new Date("1970-01-01T22:00:00Z"),
                        },
                        {
                            dayOfWeek: 2,
                            openTime: new Date("1970-01-01T08:00:00Z"),
                            closeTime: new Date("1970-01-01T22:00:00Z"),
                        },
                        {
                            dayOfWeek: 3,
                            openTime: new Date("1970-01-01T08:00:00Z"),
                            closeTime: new Date("1970-01-01T22:00:00Z"),
                        },
                        {
                            dayOfWeek: 4,
                            openTime: new Date("1970-01-01T08:00:00Z"),
                            closeTime: new Date("1970-01-01T22:00:00Z"),
                        },
                        {
                            dayOfWeek: 5,
                            openTime: new Date("1970-01-01T08:00:00Z"),
                            closeTime: new Date("1970-01-01T22:00:00Z"),
                        },
                        {
                            dayOfWeek: 6,
                            openTime: new Date("1970-01-01T08:00:00Z"),
                            closeTime: new Date("1970-01-01T22:00:00Z"),
                        },
                    ],
                },
                fields: {
                    create: fieldsData,
                },
            },
        });

        venueProms.push(venuePromise);

        // Execute in chunks
        if (venueProms.length >= chunkSize) {
            await Promise.all(venueProms);
            venueProms.length = 0;
            console.log(`Created ${i + 1} / 200 venues...`);
        }
    }

    // Process remaining venues
    if (venueProms.length > 0) {
        await Promise.all(venueProms);
        console.log(`Created 200 / 200 venues.`);
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`Seeding finished in ${duration}s.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
