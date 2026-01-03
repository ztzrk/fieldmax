const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// --- DATA GENERATORS ---

const cities = [
    { name: "Jakarta", province: "DKI Jakarta", districts: ["Senayan", "Kemang", "Tebet", "Menteng", "Pluit", "Kelapa Gading", "Pondok Indah"] },
    { name: "Bandung", province: "Jawa Barat", districts: ["Dago", "Buah Batu", "Cibaduyut", "Lembang", "Setiabudi", "Antapani"] },
    { name: "Surabaya", province: "Jawa Timur", districts: ["Tegalsari", "Gubeng", "Wonokromo", "Sukolilo", "Rungkut"] },
    { name: "Bali", province: "Bali", districts: ["Canggu", "Seminyak", "Ubud", "Kuta", "Denpasar", "Sanur"] },
    { name: "Tangerang", province: "Banten", districts: ["BSD", "Gading Serpong", "Bintaro", "Ciputat", "Pamulang"] },
    { name: "Bogor", province: "Jawa Barat", districts: ["Sentul", "Puncak", "Cibinong", "Sukasari"] },
    { name: "Yogyakarta", province: "DIY", districts: ["Malioboro", "Sleman", "Bantul", "Depok"] },
    { name: "Medan", province: "Sumatera Utara", districts: ["Medan Baru", "Medan Kota", "Helvetia"] },
    { name: "Semarang", province: "Jawa Tengah", districts: ["Simpang Lima", "Tembalang", "Banyumanik"] },
    { name: "Makassar", province: "Sulawesi Selatan", districts: ["Panakkukang", "Losari", "Tamalanrea"] },
];

const venuePrefixes = [
    "Grand", "Elite", "Mega", "Star", "Champion", "Victory", "Premier", "Royal", "Central", "City", 
    "Golden", "Silver", "Diamond", "Platinum", "United", "Global", "National", "Super", "Pro", "Master"
];

const venueTypes = [
    "Arena", "Sport Center", "Futsal", "Stadium", "Gym", "Club", "Park", "Field", "Court", "Complex", "Hub", "Zone"
];

const venueAdjectives = [
    "Sport", "Athletic", "Fitness", "Training", "Wellness", "Recreation", "Leisure", "Active", "Dynamic", "Power"
];

const reviewComments = [
    { text: "Great field! The grass was well maintained.", ratingDist: [4, 5] },
    { text: "Lighting was a bit dim for the night game, but otherwise okay.", ratingDist: [3, 4] },
    { text: "Had a blast with my team here. Good facilities.", ratingDist: [5] },
    { text: "The parking situation was a nightmare.", ratingDist: [2, 3] },
    { text: "Staff was very friendly and helpful.", ratingDist: [4, 5] },
    { text: "Price is a bit high for the quality of the turf.", ratingDist: [3] },
    { text: "Best field in the city hands down!", ratingDist: [5] },
    { text: "It was okay, nothing special.", ratingDist: [3] },
    { text: "Changing rooms were clean and spacious.", ratingDist: [4, 5] },
    { text: "Field was a bit muddy.", ratingDist: [2, 3] },
    { text: "Perfect for a 7-a-side game.", ratingDist: [5] },
    { text: "Will definitely book again.", ratingDist: [5] },
    { text: "Not enough seating for spectators.", ratingDist: [3] },
    { text: "Easy to book and find.", ratingDist: [4, 5] },
    { text: "Synthetic turf is starting to wear out in some spots.", ratingDist: [3, 2] },
    { text: "Loved the atmosphere.", ratingDist: [5] },
    { text: "A bit noisy due to the nearby road.", ratingDist: [3] },
    { text: "Excellent location.", ratingDist: [5] },
    { text: "The goal nets needed repair.", ratingDist: [2, 3] },
    { text: "Highly recommended for competitive matches.", ratingDist: [5] },
    { text: "Terrible experience, double booked!", ratingDist: [1] },
    { text: "Average field, good price.", ratingDist: [3, 4] },
    { text: "Amazing sunset view from the field.", ratingDist: [5] },
    { text: "Water fountain didn't work.", ratingDist: [2] },
    { text: "Top notch equipment available for rent.", ratingDist: [5] }
];

const photos = [
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622163642998-1ea7dad51b47?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546519638-68e109498ee3?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593341646782-e0b495cffd32?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1626224583764-847890e045b5?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?q=80&w=1000&auto=format&fit=crop"
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
    console.log("Starting massive seed (200+ venues)...");

    // --- CLEANUP ---
    try {
        console.log("Cleaning up existing data...");
        // Use deleteMany in correct order of dependency
        await prisma.review.deleteMany({});
        await prisma.booking.deleteMany({});
        await prisma.scheduleOverride.deleteMany({});
        await prisma.fieldPhoto.deleteMany({});
        await prisma.venuePhoto.deleteMany({});
        await prisma.field.deleteMany({});
        await prisma.venue.deleteMany({});
        console.log("Cleanup complete.");
    } catch (error) {
        console.warn("Cleanup warning:", error.message);
    }

    // --- 1. PREP DEPENDENCIES ---
    const renter = await prisma.user.findUnique({ where: { email: "renter@example.com" } });
    if (!renter) throw new Error("Renter not found! Run seed_users.js first.");

    const users = await prisma.user.findMany({ where: { role: "USER" } });
    // If no users, we can't seed reviews effectively, but let's try to proceed
    // Or we could fetch ALL users to be safe if there are no strict "USER" roles
    const allReviewsUsers = users.length > 0 ? users : [renter]; 

    const sportTypes = await prisma.sportType.findMany();
    if (sportTypes.length === 0) throw new Error("No sport types found! Run seed_sport_types.js first.");

    // --- 2. GENERATE VENUES ---
    const TOTAL_VENUES = 210; // 200+
    
    console.log(`Generating ${TOTAL_VENUES} venues...`);

    for (let i = 0; i < TOTAL_VENUES; i++) {
        // Randomly build identity
        const cityObj = pickRandom(cities);
        const district = pickRandom(cityObj.districts);
        const prefix = pickRandom(venuePrefixes);
        const type = pickRandom(venueTypes);
        // Sometimes use adjective, sometimes use district name in venue name
        const nameMiddle = Math.random() > 0.5 ? pickRandom(venueAdjectives) : district;
        
        let venueName = `${prefix} ${nameMiddle} ${type}`;
        // Ensure some uniqueness by appending number if simple name
        if (Math.random() > 0.8) venueName += ` ${randomInt(1, 99)}`;

        const address = `Jl. ${district} Raya No. ${randomInt(1, 200)}, ${district}`;

        // Create Venue
        const venue = await prisma.venue.create({
            data: {
                name: venueName,
                address: address,
                city: cityObj.name,
                district: district,
                province: cityObj.province,
                postalCode: randomInt(10000, 99999).toString(),
                description: `Experience top-tier sports facilities at ${venueName}. Located in the heart of ${district}, we offer professional-grade fields and amenities.`,
                renterId: renter.id,
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
                        { url: pickRandom(photos), isFeatured: false }
                    ]
                }
            }
        });

        // --- 3. GENERATE FIELDS ---
        const numFields = randomInt(3, 10);
        for (let j = 0; j < numFields; j++) {
            const sport = pickRandom(sportTypes);
            const fieldPrice = randomInt(5, 30) * 10000; // 50k - 300k
            
            const field = await prisma.field.create({
                data: {
                    venueId: venue.id,
                    name: `Field ${j + 1} (${sport.name})`,
                    description: `Professional ${sport.name} court with high-quality surface.`,
                    pricePerHour: fieldPrice,
                    sportTypeId: sport.id,
                    status: "APPROVED",
                    photos: {
                        create: [{ url: pickRandom(photos), isFeatured: true }]
                    }
                }
            });

            // --- 4. GENERATE REVIEWS (Optional per field) ---
            // 70% chance a field has reviews
            if (Math.random() < 0.7 && allReviewsUsers.length > 0) {
                const numReviews = randomInt(1, 8);
                
                for (let k = 0; k < numReviews; k++) {
                    const reviewer = pickRandom(allReviewsUsers);
                    const reviewTemplate = pickRandom(reviewComments);
                    const rating = pickRandom(reviewTemplate.ratingDist);
                    
                    // Date in past (last 90 days)
                    const daysAgo = randomInt(1, 90);
                    const bookingDate = new Date();
                    bookingDate.setDate(bookingDate.getDate() - daysAgo);
                    
                    try {
                        // Create Booking first
                        const booking = await prisma.booking.create({
                            data: {
                                userId: reviewer.id,
                                fieldId: field.id,
                                bookingDate: bookingDate,
                                startTime: new Date(bookingDate.setHours(18, 0, 0, 0)),
                                endTime: new Date(bookingDate.setHours(19, 0, 0, 0)),
                                totalPrice: fieldPrice,
                                status: "COMPLETED", // Completed for past bookings
                                paymentStatus: "PAID"
                            }
                        });

                        // Create Review
                        await prisma.review.create({
                            data: {
                                userId: reviewer.id,
                                fieldId: field.id,
                                bookingId: booking.id,
                                rating: rating,
                                comment: reviewTemplate.text,
                                createdAt: new Date(bookingDate.getTime() + 86400000) // +1 day
                            }
                        });
                    } catch (err) {
                        // Ignore booking overlap errors in seed or duplicate unique constraints
                    }
                }
            }
        }

        if ((i + 1) % 10 === 0) console.log(`Created ${i + 1} / ${TOTAL_VENUES} venues...`);
    }

    console.log("Seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
