const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// --- DATA CONSTANTS ---

const companySuffixes = ["Sports Center", "Arena", "Field", "Club", "Gym", "Stadium", "Complex", "Hub", "Zone", "Park"];
const cities = [
    { name: "Jakarta", province: "DKI Jakarta", districts: ["Senayan", "Kemang", "Tebet", "Menteng", "Pluit", "Kelapa Gading", "Pondok Indah"] },
    { name: "Bandung", province: "Jawa Barat", districts: ["Dago", "Buah Batu", "Cibaduyut", "Lembang", "Setiabudi", "Antapani"] },
    { name: "Surabaya", province: "Jawa Timur", districts: ["Tegalsari", "Gubeng", "Wonokromo", "Sukolilo", "Rungkut"] },
    { name: "Bali", province: "Bali", districts: ["Canggu", "Seminyak", "Ubud", "Kuta", "Denpasar", "Sanur"] },
    { name: "Yogyakarta", province: "DIY", districts: ["Malioboro", "Sleman", "Bantul", "Depok"] },
    { name: "Medan", province: "Sumatera Utara", districts: ["Medan Baru", "Medan Kota", "Helvetia"] },
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
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;

async function main() {
    console.log("🚀 Starting Full Simulation Seed...");

    // 1. CLEANUP
    console.log("🧹 Cleaning up old data...");
    await prisma.review.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.scheduleOverride.deleteMany({});
    await prisma.fieldPhoto.deleteMany({});
    await prisma.venuePhoto.deleteMany({});
    await prisma.field.deleteMany({});
    await prisma.venue.deleteMany({});
    await prisma.userProfile.deleteMany({});
    // Delete all users except admin to ensure a clean slate, or just delete standard users/renters
    await prisma.user.deleteMany({
        where: { role: { not: "ADMIN" } }
    });
    console.log("✅ Cleanup complete.");

    // 2. ENSURE SPORT TYPES
    const sportTypes = await prisma.sportType.findMany();
    if (sportTypes.length === 0) {
        console.log("⚠️ No sport types found, seeding default ones...");
        // Basic fallback
        const defaults = ["Futsal", "Basketball", "Football", "Badminton", "Tennis"];
        for (const name of defaults) {
            await prisma.sportType.create({ data: { name } });
        }
    }
    const allSportTypes = await prisma.sportType.findMany();
    
    const hashedPassword = await bcrypt.hash("password", 10);

    // 3. CREATE CUSTOMERS (POOL OF 50)
    console.log("bustCreating 50 Customers...");
    const customers = [];
    for (let i = 0; i < 50; i++) {
        const user = await prisma.user.create({
            data: {
                email: `user${i + 1}@example.com`,
                fullName: `Customer ${i + 1}`,
                password: hashedPassword,
                role: "USER",
                isVerified: true,
            }
        });
        customers.push(user);
    }
    console.log("✅ Created 50 Customers.");

    // 4. CREATE RENTERS (50)
    console.log("buildingCreating 50 Renters & Venues...");
    
    for (let i = 0; i < 50; i++) {
        const renterEmail = `renter${i + 1}@simulation.com`;
        const companyName = `Renter ${i + 1} ${pickRandom(companySuffixes)}`;

        const renter = await prisma.user.create({
            data: {
                email: renterEmail,
                fullName: `Renter Owner ${i + 1}`,
                password: hashedPassword,
                role: "RENTER",
                isVerified: true,
                profile: {
                    create: {
                        companyName: companyName,
                        companyDescription: `Professional sports venue provider: ${companyName}`,
                    }
                }
            }
        });

        // 5. CREATE VENUES (5-10 per Renter)
        const numVenues = randomInt(5, 10);
        for (let j = 0; j < numVenues; j++) {
            const cityObj = pickRandom(cities);
            const district = pickRandom(cityObj.districts);
            const venueName = `${companyName} ${district} Branch`;
            
            // Random Status
            const statusRoll = Math.random();
            let status = "APPROVED";
            let rejectionReason = null;

            if (statusRoll < 0.1) status = "DRAFT";
            else if (statusRoll < 0.2) status = "PENDING";
            else if (statusRoll < 0.25) {
                status = "REJECTED";
                rejectionReason = "Incomplete documents.";
            }

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
                    rejectionReason: rejectionReason,
                    schedules: {
                        create: [0, 1, 2, 3, 4, 5, 6].map(day => ({
                            dayOfWeek: day,
                            openTime: new Date("2024-01-01T08:00:00.000Z"),
                            closeTime: new Date("2024-01-01T22:00:00.000Z")
                        }))
                    },
                    photos: {
                        create: [{ url: pickRandom(photos), isFeatured: true }]
                    }
                }
            });

            // If Venue is not APPROVED, we usually don't have active fields/bookings in a real app,
            // but for simulation, let's say only APPROVED venues get full data.
            if (status !== "APPROVED") continue;

            // 6. CREATE FIELDS (3-6 per Venue)
            const numFields = randomInt(3, 6);
            for (let k = 0; k < numFields; k++) {
                const sport = pickRandom(allSportTypes);
                
                // Random Field Status
                // Most approved if venue is approved
                const fieldStatusRoll = Math.random();
                let fieldStatus = "APPROVED";
                if (fieldStatusRoll < 0.1) fieldStatus = "PENDING";
                
                const isClosed = Math.random() < 0.05; // 5% chance closed

                const field = await prisma.field.create({
                    data: {
                        venueId: venue.id,
                        name: `Field ${k + 1} (${sport.name})`,
                        description: `${sport.name} court`,
                        pricePerHour: randomInt(5, 20) * 10000,
                        sportTypeId: sport.id,
                        status: fieldStatus,
                        isClosed: isClosed,
                        photos: {
                             create: [{ url: pickRandom(photos), isFeatured: true }]
                        }
                    }
                });

                if (fieldStatus !== "APPROVED") continue;

                // 7. CREATE BOOKINGS (0-100 per Field)
                const numBookings = randomInt(0, 100);
                
                // Batch create bookings? Or loop. Loop is fine for < 50k total records in seed.
                // To performance optimize, maybe just do 0-20 for speed, user asked 0-100.
                
                for (let b = 0; b < numBookings; b++) {
                    const customer = pickRandom(customers);
                    const daysOffset = randomInt(-100, 30); // 100 days ago to 30 days future
                    const bookingDate = new Date();
                    bookingDate.setDate(bookingDate.getDate() + daysOffset);
                    bookingDate.setHours(0,0,0,0);

                    // Determine Status
                    let bookingStatus = "PENDING";
                    let paymentStatus = "PENDING";
                    
                    if (daysOffset < 0) {
                        // Past
                        const r = Math.random();
                        if (r < 0.8) {
                            bookingStatus = "COMPLETED";
                            paymentStatus = "PAID";
                        } else if (r < 0.9) {
                            bookingStatus = "CANCELLED";
                            paymentStatus = "FAILED";
                        } else {
                            bookingStatus = "PENDING"; // Stale pending
                        }
                    } else {
                        // Future
                        const r = Math.random();
                        if (r < 0.5) {
                            bookingStatus = "CONFIRMED";
                            paymentStatus = "PAID";
                        } else {
                            bookingStatus = "PENDING";
                        }
                    }

                    try {
                        const booking = await prisma.booking.create({
                           data: {
                               userId: customer.id,
                               fieldId: field.id,
                               bookingDate: bookingDate,
                               startTime: new Date(bookingDate.getTime() + 1000 * 60 * 60 * 10), // 10 AM
                               endTime: new Date(bookingDate.getTime() + 1000 * 60 * 60 * 12),   // 12 PM
                               totalPrice: field.pricePerHour * 2,
                               status: bookingStatus,
                               paymentStatus: paymentStatus,
                           } 
                        });

                        // 8. REVIEWS (Optional for completed bookings)
                        if (bookingStatus === "COMPLETED" && Math.random() < 0.5) {
                            const tmpl = pickRandom(reviewTemplates);
                            await prisma.review.create({
                                data: {
                                    userId: customer.id,
                                    fieldId: field.id,
                                    bookingId: booking.id,
                                    rating: tmpl.rating,
                                    comment: tmpl.text,
                                }
                            });
                        }

                    } catch(e) {
                        // Ignore conflicts in seed
                    }
                }
            }
        }
        
        console.log(`Finished Renter ${i+1}/${50} (${companyName})`);
    }

    console.log("✅ Seed complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
