import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Debugging Renter Data ---");

    const totalBookings = await prisma.booking.count();
    console.log(`Total Bookings in Database: ${totalBookings}`);

    if (totalBookings === 0) {
        console.log(
            "Database has NO bookings at all. This explains the empty list."
        );
        return;
    }

    const sampleBooking = await prisma.booking.findFirst({
        include: {
            field: {
                include: { venue: true },
            },
        },
    });

    if (sampleBooking) {
        console.log(`\nSample Booking ID: ${sampleBooking.id}`);
        console.log(`  Field: ${sampleBooking.field.name}`);
        console.log(`  Venue: ${sampleBooking.field.venue.name}`);
        console.log(
            `  Venue Owner (Renter) ID: ${sampleBooking.field.venue.renterId}`
        );
    }

    const renter = await prisma.user.findFirst({
        where: { role: "RENTER" },
    });

    if (!renter) {
        console.log("No Renter found in database.");
        return;
    }

    console.log(`\nTarget Renter: ${renter.email} (${renter.id})`);

    if (sampleBooking && sampleBooking.field.venue.renterId !== renter.id) {
        console.log("  ! The sample booking belongs to a DIFFERENT renter.");
    } else {
        console.log("  The sample booking belongs to this renter.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
