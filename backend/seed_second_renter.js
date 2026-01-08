const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const cities = [
    { name: "Jakarta", province: "DKI Jakarta", districts: ["Senayan", "Kemang", "Tebet"] },
    { name: "Bandung", province: "Jawa Barat", districts: ["Dago", "Buah Batu", "Cibaduyut"] },
];

const venuePrefixes = ["Second", "Another", "Alternative"];
const venueTypes = ["Arena", "Sport Center", "Futsal"];
const photos = [
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
    console.log("Seeding second renter...");

    const hashedPassword = await bcrypt.hash("password", 10);

    // 1. Create Second Renter
    const renter2 = await prisma.user.upsert({
        where: { email: "renter2@example.com" },
        update: {},
        create: {
            email: "renter2@example.com",
            fullName: "Second Renter",
            password: hashedPassword,
            role: "RENTER",
            isVerified: true,
        },
    });
    console.log({ renter2 });

    const sportTypes = await prisma.sportType.findMany();
    if (sportTypes.length === 0) throw new Error("No sport types found! Run seed_sport_types.js first.");

    // 2. Create Venues for Renter 2
    const NUM_VENUES = 3;
    console.log(`Generating ${NUM_VENUES} venues for renter2...`);

    for (let i = 0; i < NUM_VENUES; i++) {
        const cityObj = pickRandom(cities);
        const district = pickRandom(cityObj.districts);
        const prefix = pickRandom(venuePrefixes);
        const type = pickRandom(venueTypes);
        const venueName = `${prefix} ${type} ${i + 1}`;
        const address = `Jl. ${district} No. ${randomInt(1, 100)}`;

        const venue = await prisma.venue.create({
            data: {
                name: venueName,
                address: address,
                city: cityObj.name,
                district: district,
                province: cityObj.province,
                postalCode: randomInt(10000, 99999).toString(),
                description: `Second renter venue description for ${venueName}`,
                renterId: renter2.id,
                status: "APPROVED",
                schedules: {
                    create: [
                        { dayOfWeek: 1, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 2, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 3, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 4, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T22:00:00.000Z") },
                        { dayOfWeek: 5, openTime: new Date("2024-01-01T08:00:00.000Z"), closeTime: new Date("2024-01-01T23:00:00.000Z") },
                        { dayOfWeek: 6, openTime: new Date("2024-01-01T07:00:00.000Z"), closeTime: new Date("2024-01-01T23:00:00.000Z") },
                        { dayOfWeek: 0, openTime: new Date("2024-01-01T07:00:00.000Z"), closeTime: new Date("2024-01-01T23:00:00.000Z") },
                    ]
                },
                photos: {
                    create: [
                        { url: pickRandom(photos), isFeatured: true },
                    ]
                }
            }
        });

        // 3. Create Fields
        const numFields = randomInt(2, 4);
        for (let j = 0; j < numFields; j++) {
            const sport = pickRandom(sportTypes);
            const fieldPrice = randomInt(5, 15) * 10000;

            const field = await prisma.field.create({
                data: {
                    venueId: venue.id,
                    name: `Field ${j + 1} - ${venueName}`,
                    description: `Field description`,
                    pricePerHour: fieldPrice,
                    sportTypeId: sport.id,
                    status: "APPROVED",
                    photos: {
                        create: [{ url: pickRandom(photos), isFeatured: true }]
                    }
                }
            });

            // 4. Create PAID Bookings (Revenue)
            // Create 5-10 bookings per field
            const numBookings = randomInt(5, 10);
            for (let k = 0; k < numBookings; k++) {
                const bookingDate = new Date();
                bookingDate.setDate(bookingDate.getDate() - randomInt(1, 30)); // Past 30 days

                await prisma.booking.create({
                    data: {
                        userId: renter2.id, // Self booking for simplicity, or we should fetch a user. Renter can book too? Let's use renter2 as user for simplicity or fetch 'user'.
                        fieldId: field.id,
                        bookingDate: bookingDate,
                        startTime: new Date(bookingDate.setHours(10, 0, 0, 0)),
                        endTime: new Date(bookingDate.setHours(12, 0, 0, 0)),
                        totalPrice: fieldPrice * 2, // 2 hours
                        status: "COMPLETED",
                        paymentStatus: "PAID"
                    }
                });
            }
        }
    }

    console.log("Seeding second renter finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
