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

async function main() {
    console.log("Seeding venues and fields...");

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
                name: venueName,
                address: address,
                description: `A premium sports venue located in ${address}.`,
                renterId: renter.id,
                status: "APPROVED", // Approved as requested
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
