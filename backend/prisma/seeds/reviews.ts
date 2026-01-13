import { PrismaClient } from "@prisma/client";

const comments = [
    "Great field! The grass was well maintained.",
    "Lighting was a bit dim for the night game, but otherwise okay.",
    "Had a blast with my team here. Good facilities.",
    "The parking situation was a nightmare.",
    "Staff was very friendly and helpful.",
    "Price is a bit high for the quality of the turf.",
    "Best field in the city hands down!",
    "It was okay, nothing special.",
    "Changing rooms were clean and spacious.",
    "Field was a bit muddy after the rain.",
    "Perfect for a 7-a-side game.",
    "Will definitely book again.",
    "Not enough seating for spectators.",
    "Easy to book and find.",
    "Synthetic turf is starting to wear out in some spots.",
    "Loved the atmosphere.",
    "A bit noisy due to the nearby road.",
    "Excellent location.",
    "The goal nets needed repair.",
    "Highly recommended for competitive matches.",
    "Terrible experience, double booked!",
    "Average field, good price.",
    "Amazing sunset view from the field.",
    "Water fountain didn't work.",
    "Top notch equipment available for rent.",
];

export async function seedReviews(prisma: PrismaClient) {
    console.log("Seeding reviews...");

    // 1. Get all fields and users
    const fields = await prisma.field.findMany({
        where: { status: "APPROVED" },
    });
    const users = await prisma.user.findMany({
        where: { role: "USER" },
    });

    if (fields.length === 0) {
        console.log("No approved fields found. Run seed_venues.ts first.");
        return;
    }
    if (users.length === 0) {
        console.log("No users found. Run seed_users.ts first.");
        return;
    }

    console.log(`Found ${fields.length} fields and ${users.length} users.`);

    // 2. Create bookings and reviews
    let reviewsCreated = 0;

    for (let i = 0; i < 30; i++) {
        const field = fields[Math.floor(Math.random() * fields.length)];
        const user = users[Math.floor(Math.random() * users.length)];

        // Random rating 1-5, weighted slightly towards positive
        // Math.random() < 0.2 ? 1-3 : 4-5
        let rating: number;
        const r = Math.random();
        if (r < 0.1) rating = 1;
        else if (r < 0.25) rating = 2;
        else if (r < 0.45) rating = 3;
        else if (r < 0.75) rating = 4;
        else rating = 5;

        const comment = comments[Math.floor(Math.random() * comments.length)];

        // Create a past booking
        const bookingDate = new Date();
        bookingDate.setDate(
            bookingDate.getDate() - Math.floor(Math.random() * 60) - 1
        ); // 1-60 days ago

        // Create booking first
        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                fieldId: field.id,
                bookingDate: bookingDate,
                startTime: new Date(bookingDate.setHours(18, 0, 0, 0)), // 6 PM
                endTime: new Date(bookingDate.setHours(19, 0, 0, 0)), // 7 PM
                totalPrice: field.pricePerHour,
                status: "CONFIRMED",
            },
        });

        // Create review
        await prisma.review.create({
            data: {
                userId: user.id,
                fieldId: field.id,
                bookingId: booking.id,
                rating: rating,
                comment: comment,
                createdAt: new Date(
                    bookingDate.getTime() + 1000 * 60 * 60 * 24
                ), // 1 day after booking
            },
        });

        reviewsCreated++;
    }

    console.log(`Successfully created ${reviewsCreated} reviews.`);
}
