const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Starting Booking & Review Seeding...");

    // 1. Clean up existing reviews
    try {
        await prisma.review.deleteMany({});
        console.log("Cleared existing reviews.");
    } catch (e) {
        console.log("No reviews to delete or error clearing reviews:", e.message);
    }

    // 2. Fetch necessary data
    const users = await prisma.user.findMany({
        where: { role: "USER" },
        take: 50 // Use a subset of users to be faster
    });

    const fields = await prisma.field.findMany({
        where: { status: "APPROVED" },
        take: 50 // Use a subset of fields
    });

    if (users.length === 0 || fields.length === 0) {
        console.error("Not enough users or fields to seed reviews. Run seed_large_dataset.js first.");
        return;
    }

    console.log(`Found ${users.length} users and ${fields.length} fields to use for seeding.`);

    // 3. Generate Bookings and Reviews
    const reviewsToCreate = 200; // Target number of reviews
    let createdCount = 0;

    const comments = [
        "Great field, well maintained!",
        "Had a blast playing here.",
        "Grass was a bit slippery but overall good.",
        "Excellent facilities and friendly staff.",
        "Lighting could be better for night games.",
        "Perfect for 5-a-side matches.",
        "Will definitely book again.",
        "Clean restrooms and changing areas.",
        "A bit expensive but worth it.",
        "Highly recommended!",
        "The turf quality is amazing.",
        "Easy to access and good parking.",
        "Game was intense! Pitch held up well.",
        "Standard field, nothing special.",
        "Love playing here every week."
    ];

    console.log("Creating bookings and reviews...");

    for (let i = 0; i < reviewsToCreate; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const field = fields[Math.floor(Math.random() * fields.length)];
        const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
        const comment = comments[Math.floor(Math.random() * comments.length)];
        
        // Random date in the past 30 days
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const bookingDate = new Date();
        bookingDate.setDate(bookingDate.getDate() - daysAgo);

        try {
            // Transaction to ensure Booking exists for the Review
            await prisma.$transaction(async (tx) => {
                // Create Completed Booking
                const booking = await tx.booking.create({
                    data: {
                        userId: user.id,
                        fieldId: field.id,
                        bookingDate: bookingDate,
                        startTime: new Date("1970-01-01T10:00:00Z"),
                        endTime: new Date("1970-01-01T12:00:00Z"),
                        totalPrice: field.pricePerHour * 2,
                        status: "COMPLETED",
                        paymentStatus: "PAID",
                    }
                });

                // Create Review linked to Booking
                await tx.review.create({
                    data: {
                        rating: rating,
                        comment: comment,
                        userId: user.id,
                        fieldId: field.id,
                        bookingId: booking.id, // Link to the booking we just created
                    }
                });
            });
            createdCount++;
            if (createdCount % 20 === 0) process.stdout.write(".");
        } catch (error) {
            console.error(`Failed to seed review ${i}:`, error.message);
        }
    }

    console.log(`\nSuccessfully created ${createdCount} bookings with reviews.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
