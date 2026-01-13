import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// --- CONFIGURATION ---
type Scale = "SMALL" | "MEDIUM" | "LARGE";

export async function seedSimulation(scale: Scale = "MEDIUM") {
    // Allow override via env if not passed explicitly, but default to arg
    const envScale = process.env.SEED_SCALE as Scale;
    const FINAL_SCALE = envScale || scale;

    const CONFIG = {
        SMALL: {
            customers: 20,
            renters: 5,
            venuesPerRenter: { min: 1, max: 2 },
            fieldsPerVenue: { min: 2, max: 3 },
            bookingsPerField: { min: 5, max: 10 },
        },
        MEDIUM: {
            customers: 100,
            renters: 30,
            venuesPerRenter: { min: 2, max: 5 },
            fieldsPerVenue: { min: 3, max: 6 },
            bookingsPerField: { min: 20, max: 50 },
        },
        LARGE: {
            customers: 500,
            renters: 100,
            venuesPerRenter: { min: 3, max: 8 },
            fieldsPerVenue: { min: 4, max: 8 },
            bookingsPerField: { min: 50, max: 150 },
        },
    };

    const SETTINGS = CONFIG[FINAL_SCALE];

    console.log(`\n🚀 STARTING SIMULATION SEED [SCALE: ${FINAL_SCALE}]`);
    console.log(`   - Customers: ${SETTINGS.customers}`);
    console.log(`   - Renters: ${SETTINGS.renters}`);
    console.log(
        `   - Est. Venues: ${
            SETTINGS.renters *
            ((SETTINGS.venuesPerRenter.min + SETTINGS.venuesPerRenter.max) / 2)
        }`
    );
    console.log(`   - Est. Bookings: "Many"...\n`);

    // --- DATA CONSTANTS ---

    const companySuffixes = [
        "Sports Center",
        "Arena",
        "Field",
        "Club",
        "Gym",
        "Stadium",
        "Complex",
        "Hub",
        "Zone",
        "Park",
    ];
    const cities = [
        {
            name: "Jakarta",
            province: "DKI Jakarta",
            districts: [
                "Senayan",
                "Kemang",
                "Tebet",
                "Menteng",
                "Pluit",
                "Kelapa Gading",
                "Pondok Indah",
            ],
        },
        {
            name: "Bandung",
            province: "Jawa Barat",
            districts: [
                "Dago",
                "Buah Batu",
                "Cibaduyut",
                "Lembang",
                "Setiabudi",
                "Antapani",
            ],
        },
        {
            name: "Surabaya",
            province: "Jawa Timur",
            districts: [
                "Tegalsari",
                "Gubeng",
                "Wonokromo",
                "Sukolilo",
                "Rungkut",
            ],
        },
        {
            name: "Bali",
            province: "Bali",
            districts: [
                "Canggu",
                "Seminyak",
                "Ubud",
                "Kuta",
                "Denpasar",
                "Sanur",
            ],
        },
        {
            name: "Yogyakarta",
            province: "DIY",
            districts: ["Malioboro", "Sleman", "Bantul", "Depok"],
        },
        {
            name: "Medan",
            province: "Sumatera Utara",
            districts: ["Medan Baru", "Medan Kota", "Helvetia"],
        },
    ];

    const photos = [
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1622163642998-1ea7dad51b47?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop",
    ];

    const reviewTemplates = [
        { text: "Great field! The grass was well maintained.", rating: 5 },
        { text: "Lighting was a bit dim for the night game.", rating: 3 },
        { text: "Good facilities, but parking was hard.", rating: 4 },
        { text: "Terrible experience, double booked!", rating: 1 },
        { text: "Average field, good price.", rating: 3 },
        { text: "Amazing view and atmosphere.", rating: 5 },
        { text: "Clean changing rooms.", rating: 4 },
    ];

    // --- HELPERS ---
    const pickRandom = (arr: any[]) =>
        arr[Math.floor(Math.random() * arr.length)];
    const randomInt = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    // chunkArray helper for parallel processing limitation
    async function processInChunks<T>(
        items: T[],
        chunkSize: number,
        iterator: (item: T, index: number) => Promise<any>
    ) {
        for (let i = 0; i < items.length; i += chunkSize) {
            const chunk = items.slice(i, i + chunkSize);
            await Promise.all(
                chunk.map((item, idx) => iterator(item, i + idx))
            );
            process.stdout.write(`.`); // Progress dot per chunk
        }
    }

    // 1. CLEANUP
    console.log("🧹 Cleaning up old data...");
    // Order matters for relational integrity
    try {
        await prisma.review.deleteMany({});
        await prisma.payment.deleteMany({});
        await prisma.booking.deleteMany({});
        await prisma.fieldPhoto.deleteMany({});
        await prisma.venuePhoto.deleteMany({});
        await prisma.field.deleteMany({});
        await prisma.venue.deleteMany({});
        await prisma.userProfile.deleteMany({});
        await prisma.user.deleteMany({ where: { role: { not: "ADMIN" } } });
        console.log("✅ Cleanup complete.\n");
    } catch (e: any) {
        console.log("ℹ️ Cleanup skipped or partial (first run?): " + e.message);
    }

    // 2. ENSURE SPORT TYPES
    let allSportTypes = await prisma.sportType.findMany();
    if (allSportTypes.length === 0) {
        console.log("⚠️ No sport types found, seeding default ones...");
        const defaults = [
            "Futsal",
            "Basketball",
            "Football",
            "Badminton",
            "Tennis",
        ];
        for (const name of defaults) {
            await prisma.sportType.create({ data: { name } });
        }
        allSportTypes = await prisma.sportType.findMany();
    }

    const hashedPassword = await bcrypt.hash("password", 10);
    const dateNow = Date.now();

    // 3. ENSURE ADMIN & BULK CREATE CUSTOMERS
    const adminEmail = "admin@example.com";
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                fullName: "Super Admin",
                password: hashedPassword,
                role: "ADMIN",
                isVerified: true,
            },
        });
        console.log("✅ Admin Created.");
    }

    // We use createMany for speed, as Customers don't have complex deps yet
    console.log(`bust Creating ${SETTINGS.customers} Customers...`);
    const customerData = Array.from({ length: SETTINGS.customers }).map(
        (_, i) => ({
            email: `user${i + 1}_${dateNow}@example.com`,
            fullName: `Customer ${i + 1}`,
            password: hashedPassword,
            role: "USER" as UserRole,
            isVerified: true,
        })
    );
    await prisma.user.createMany({ data: customerData });
    const customers = await prisma.user.findMany({ where: { role: "USER" } });
    console.log(`✅ Customers Created.\n`);

    // 4. PROCESS RENTERS (Chunked)
    console.log(
        `building Processing ${SETTINGS.renters} Renters (Parallel Batches)...`
    );

    // We generate the Renters Array first.
    const rentersToCreate = Array.from({ length: SETTINGS.renters }).map(
        (_, i) => i
    );

    let totalVenues = 0;
    let totalBookings = 0;

    await processInChunks(rentersToCreate, 10, async (i) => {
        const companyName = `Company ${i + 1} ${pickRandom(companySuffixes)}`;

        // Create Renter + Profile
        const renter = await prisma.user.create({
            data: {
                email: `renter${i + 1}_${dateNow}@simulation.com`,
                fullName: `Renter Owner ${i + 1}`,
                password: hashedPassword,
                role: "RENTER",
                isVerified: true,
                profile: {
                    create: {
                        companyName: companyName,
                        companyDescription: `Professional sports venue provider: ${companyName}`,
                    },
                },
            },
        });

        // Generate Venues
        const numVenues = randomInt(
            SETTINGS.venuesPerRenter.min,
            SETTINGS.venuesPerRenter.max
        );

        for (let j = 0; j < numVenues; j++) {
            totalVenues++;
            const cityObj = pickRandom(cities);
            const district = pickRandom(cityObj.districts);
            const venueName = `${companyName} ${district} Branch`;

            // Venue Status Logic
            const statusRoll = Math.random();
            let status: "APPROVED" | "DRAFT" | "PENDING" | "REJECTED" =
                "APPROVED";
            if (statusRoll < 0.05) status = "DRAFT";
            else if (statusRoll < 0.1) status = "PENDING";
            else if (statusRoll < 0.15) status = "REJECTED";

            const venue = await prisma.venue.create({
                data: {
                    name: venueName,
                    address: `Jl. ${district} No. ${randomInt(1, 999)}`,
                    city: cityObj.name,
                    district: district,
                    province: cityObj.province,
                    postalCode: randomInt(10000, 99999).toString(),
                    description: `Located in ${district}, ${venueName} offers great facilities.`,
                    renterId: renter.id,
                    status: status,
                    rejectionReason:
                        status === "REJECTED" ? "Incomplete documents." : null,
                    schedules: {
                        create: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
                            dayOfWeek: day,
                            openTime: new Date("2024-01-01T08:00:00.000Z"),
                            closeTime: new Date("2024-01-01T22:00:00.000Z"),
                        })),
                    },
                    photos: {
                        create: [{ url: pickRandom(photos), isFeatured: true }],
                    },
                },
            });

            if (status !== "APPROVED") continue; // Skip fields/bookings for non-approved

            // Generate Fields
            const numFields = randomInt(
                SETTINGS.fieldsPerVenue.min,
                SETTINGS.fieldsPerVenue.max
            );
            for (let k = 0; k < numFields; k++) {
                const sport = pickRandom(allSportTypes);
                const field = await prisma.field.create({
                    data: {
                        venueId: venue.id,
                        name: `Field ${k + 1} (${sport.name})`,
                        description: `${sport.name} court`,
                        pricePerHour: randomInt(5, 20) * 10000,
                        sportTypeId: sport.id,
                        status: "APPROVED",
                        isClosed: Math.random() < 0.02,
                        photos: {
                            create: [
                                { url: pickRandom(photos), isFeatured: true },
                            ],
                        },
                    },
                });

                // Generate Bookings
                const numBookings = randomInt(
                    SETTINGS.bookingsPerField.min,
                    SETTINGS.bookingsPerField.max
                );
                // We create a batch of bookings to insert concurrently?
                // Creating one by one in a loop is safe but slow.
                // Let's optimize: Create data array then map to promises.

                const bookingPromises = [];

                for (let b = 0; b < numBookings; b++) {
                    const customer = pickRandom(customers);
                    if (!customer) continue;

                    const daysOffset = randomInt(-100, 30);
                    const bookingDate = new Date();
                    bookingDate.setDate(bookingDate.getDate() + daysOffset);
                    bookingDate.setHours(0, 0, 0, 0);

                    // Logic for Status
                    let bStatus = "PENDING";
                    let pStatus = "PENDING";
                    let isPast = daysOffset < 0;

                    if (isPast) {
                        const r = Math.random();
                        if (r < 0.8) {
                            bStatus = "COMPLETED";
                            pStatus = "PAID";
                        } else if (r < 0.9) {
                            bStatus = "CANCELLED";
                            pStatus = "FAILED";
                        } else {
                            bStatus = "PENDING";
                        } // Stale
                    } else {
                        const r = Math.random();
                        if (r < 0.6) {
                            bStatus = "CONFIRMED";
                            pStatus = "PAID";
                        } else {
                            bStatus = "PENDING";
                        }
                    }

                    const bookingData: any = {
                        userId: customer.id,
                        fieldId: field.id,
                        bookingDate: bookingDate,
                        startTime: new Date(
                            bookingDate.getTime() + 1000 * 60 * 60 * 10
                        ), // 10 AM
                        endTime: new Date(
                            bookingDate.getTime() + 1000 * 60 * 60 * 12
                        ), // 12 PM
                        totalPrice: field.pricePerHour * 2,
                        status: bStatus as any,
                        payment: {
                            create: {
                                amount: field.pricePerHour * 2,
                                status: pStatus as any,
                            },
                        },
                    };

                    // Add Review if Completed
                    if (bStatus === "COMPLETED" && Math.random() < 0.5) {
                        const tmpl = pickRandom(reviewTemplates);
                        bookingData.review = {
                            create: {
                                userId: customer.id,
                                fieldId: field.id,
                                rating: tmpl.rating,
                                comment: tmpl.text,
                            },
                        };
                    }

                    bookingPromises.push(
                        prisma.booking.create({ data: bookingData })
                    );
                }

                await Promise.all(bookingPromises);
                totalBookings += numBookings;
            }
        }
    });

    console.log(`\n\n✅ Seed Complete!`);
    console.log(`   - Venues: ${totalVenues}`);
    console.log(`   - Bookings: ${totalBookings}`);
}

// Execute if run directly
if (require.main === module) {
    seedSimulation()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
