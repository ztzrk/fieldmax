import {
    PrismaClient,
    UserRole,
    PaymentStatus,
    BookingStatus,
} from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Revenue Data...");

    // 1. Target "Renter Owner 1" or fallback
    const password = await hash("password123", 10);
    let email = "renter1@simulation.com"; // Common seed email

    let renter = await prisma.user.findUnique({ where: { email } });

    if (!renter) {
        // Fallback: Find ANY renter to seed data for (likely the one logged in)
        renter = await prisma.user.findFirst({
            where: { role: UserRole.RENTER },
        });
    }

    if (!renter) {
        // Last resort: Create new demo user
        email = "renter_demo_v2@example.com";
        renter = await prisma.user.create({
            data: {
                email,
                password,
                fullName: "Demo Renter V2",
                role: UserRole.RENTER,
                isVerified: true,
                phoneNumber: "08111111122",
            },
        });
        console.log("Created Renter: renter_demo_v2@example.com");
    } else {
        console.log(`Seeding data for found Renter: ${renter.email}`);
    }

    // 2. Create Venue
    let venue = await prisma.venue.findFirst({
        where: { renterId: renter.id },
    });
    if (!venue) {
        venue = await prisma.venue.create({
            data: {
                name: "Revenue Demo Venue",
                address: "123 Money St",
                renterId: renter.id,
                description: "A venue for making money",
                status: "APPROVED",
            },
        });
        console.log("Created Venue");
    }

    // 3. Create Field
    let field = await prisma.field.findFirst({ where: { venueId: venue.id } });
    if (!field) {
        const sportType = await prisma.sportType.findFirst();
        if (!sportType) throw new Error("No sport types found in DB");

        field = await prisma.field.create({
            data: {
                name: "Money Field",
                venueId: venue.id,
                sportTypeId: sportType.id,
                pricePerHour: 100000,
                status: "APPROVED",
            },
        });
        console.log("Created Field");
    }

    // 4. Create PAID Bookings (Historical)
    const today = new Date();

    // Create bookings for the last 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Random amount between 1 and 3 hours
        const hours = Math.floor(Math.random() * 3) + 1;
        const totalPrice = hours * field.pricePerHour;

        const booking = await prisma.booking.create({
            data: {
                userId: renter.id, // Renter booking their own field for simplicity, or any user
                fieldId: field.id,
                bookingDate: date,
                startTime: new Date(date.setHours(10, 0, 0)),
                endTime: new Date(date.setHours(10 + hours, 0, 0)),
                totalPrice,
                status: BookingStatus.COMPLETED,
            },
        });

        // Create Payment
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                amount: totalPrice,
                status: PaymentStatus.PAID,
                snapToken: `dummy_token_${i}`,
            },
        });
        console.log(
            `Created PAID booking for ${
                date.toISOString().split("T")[0]
            }: ${totalPrice}`
        );
    }

    console.log(
        "Seeding Complete. Please login as 'renter_demo@example.com' / 'password123'"
    );
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
