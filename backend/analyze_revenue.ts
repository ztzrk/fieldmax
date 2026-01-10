import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "renter1@simulation.com"; // Renter Owner 1
    const renter = await prisma.user.findUnique({ where: { email } });

    if (!renter) {
        console.log(`User ${email} not found.`);
        return;
    }

    console.log(`Analyzing Bookings for: ${renter.fullName} (${renter.email})`);

    // 1. All Bookings found via Venue
    const allBookings = await prisma.booking.findMany({
        where: {
            field: {
                venue: {
                    renterId: renter.id,
                },
            },
        },
        include: {
            payment: true,
            field: {
                select: { name: true, venue: { select: { name: true } } },
            },
        },
    });

    console.log(`Total Bookings Visible: ${allBookings.length}`);

    // 2. Breakdown by Payment Status
    let paidCount = 0;
    let paidRevenue = 0;

    let pendingCount = 0;
    let pendingRevenue = 0;

    let noPaymentCount = 0;
    let noPaymentRevenue = 0;

    let otherCount = 0;
    let otherRevenue = 0;

    allBookings.forEach((b) => {
        if (!b.payment) {
            noPaymentCount++;
            noPaymentRevenue += b.totalPrice;
        } else if (b.payment.status === "PAID") {
            paidCount++;
            paidRevenue += b.totalPrice;
        } else if (b.payment.status === "PENDING") {
            pendingCount++;
            pendingRevenue += b.totalPrice;
        } else {
            otherCount++;
            otherRevenue += b.totalPrice;
        }
    });

    console.log("\n--- REVENUE BREAKDOWN ---");
    console.log(
        `✅ PAID:       ${paidCount} bookings | Rp ${paidRevenue.toLocaleString()}`
    );
    console.log(
        `⏳ PENDING:    ${pendingCount} bookings | Rp ${pendingRevenue.toLocaleString()}`
    );
    console.log(
        `❌ NO PAYMENT: ${noPaymentCount} bookings | Rp ${noPaymentRevenue.toLocaleString()}`
    );
    console.log(
        `❓ OTHER:      ${otherCount} bookings | Rp ${otherRevenue.toLocaleString()} (Status: ${
            allBookings.find(
                (b) =>
                    b.payment &&
                    b.payment.status !== "PAID" &&
                    b.payment.status !== "PENDING"
            )?.payment?.status || "N/A"
        })`
    );

    console.log("\n--- EXPLANATION ---");
    console.log(`The Dashboard ONLY counts 'PAID' bookings.`);
    console.log(
        `Your Total Potential Revenue: Rp ${(
            paidRevenue +
            pendingRevenue +
            noPaymentRevenue +
            otherRevenue
        ).toLocaleString()}`
    );
    console.log(
        `Your Actual Dashboard Revenue: Rp ${paidRevenue.toLocaleString()}`
    );
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
