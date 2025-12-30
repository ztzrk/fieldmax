const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const venueNames = [
    "Gelora Bung Karno",
    "Stadion Madya",
    "Tennis Indoor Senayan",
    "Istora Senayan",
    "Lapangan ABC",
];

const addresses = [
    "Jl. Pintu Satu Senayan, Jakarta",
    "Jl. Asia Afrika, Jakarta",
    "Jl. Gerbang Pemuda, Jakarta",
    "Jl. Jend. Sudirman, Jakarta",
    "Jl. Gatot Subroto, Jakarta",
];

const fieldNames = ["Field A", "Field B", "Field C"];

const staticVenueIds = [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
    "33333333-3333-4333-8333-333333333333",
    "44444444-4444-4444-8444-444444444444",
    "55555555-5555-4555-8555-555555555555"
];

async function main() {
    console.log("Seeding venues and fields...");

    // CLEANUP: Delete existing data to avoid duplicates and ensure fresh data
    try {
        await prisma.booking.deleteMany({}); // Delete bookings first to avoid FK constraints
        await prisma.scheduleOverride.deleteMany({}); // Delete overrides
        await prisma.review.deleteMany({}); // Delete reviews
        await prisma.field.deleteMany({});   // Fields might not cascade automatically depending on DB setup, safer to explicit
        await prisma.venue.deleteMany({});   // Delete venues
        console.log("Deleted existing bookings, reviews, fields, and venues.");
    } catch (error) {
        console.warn("Warning: Could not clean up some existing data (maybe tables don't exist yet). Continuing...", error.message);
    }

    // 1. Get Renter
    const renter = await prisma.user.findUnique({
        where: { email: "renter@example.com" },
    });

    if (!renter) {
        console.error("Renter not found! Please run seed_users.js first.");
        return;
    }

    // 2. Get Sport Types
    const sportTypes = await prisma.sportType.findMany();
    if (sportTypes.length === 0) {
        console.error("No sport types found! Please run seed_sport_types.js first.");
        return;
    }

    // 3. Create Venues and Fields
    for (let i = 0; i < 5; i++) {
        const venueName = venueNames[i] || `Venue ${i + 1}`;
        const address = addresses[i] || `Address ${i + 1}`;

        // Random sport types for fields
        const venueSports = [
            sportTypes[Math.floor(Math.random() * sportTypes.length)],
            sportTypes[Math.floor(Math.random() * sportTypes.length)],
            sportTypes[Math.floor(Math.random() * sportTypes.length)],
        ];

        const venueKey = `venue-${i}`;

        // Create Venue with Fields using nested writes
        const venue = await prisma.venue.create({
            data: {
                id: staticVenueIds[i],
                name: venueName,
                address: address,
                city: "Jakarta",
                district: "Senayan",
                province: "DKI Jakarta",
                postalCode: "10270",
                description: `A premium sports venue located in ${address}.`,
                renterId: renter.id,
                status: "APPROVED", // Approved as requested
                schedules: {
                    create: [
                        { dayOfWeek: 1, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 2, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 3, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 4, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 5, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 6, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T23:00:00.000Z") },
                        { dayOfWeek: 0, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T23:00:00.000Z") },
                    ]
                },
                fields: {
                    create: venueSports.map((sport, index) => ({
                        name: `${venueName} - ${fieldNames[index]} (${sport.name})`,
                        description: `High quality ${sport.name} field.`,
                        pricePerHour: 100000 + (index * 50000), // 100k, 150k, 200k
                        sportTypeId: sport.id,
                        status: "APPROVED",
                    })),
                },
            },
        });

        console.log(`Created approved venue: ${venue.name} with ${venueSports.length} fields.`);
    }

    console.log("Venue seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
