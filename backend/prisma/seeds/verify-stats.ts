import prisma from "../../src/db";

async function main() {
    const totalBookings = await prisma.booking.count();
    const totalUsers = await prisma.user.count();
    const totalVenues = await prisma.venue.count();
    const totalFields = await prisma.field.count();
    const totalReviews = await prisma.review.count();

    const bookingsByYear: any = await prisma.$queryRaw`
        SELECT EXTRACT(YEAR FROM booking_date)::int as year, count(*)::int as count 
        FROM bookings 
        GROUP BY year 
        ORDER BY year ASC
    `;

    const sampleReviews = await prisma.review.findMany({
        take: 3,
        select: {
            rating: true,
            comment: true,
            createdAt: true,
            field: {
                select: {
                    name: true,
                    venue: { select: { name: true, city: true } }
                }
            }
        }
    });

    console.log("\n--- RINGKASAN HASIL SEED DATA SIMULASI ---");
    console.log(`Total Pengguna (Users): ${totalUsers}`);
    console.log(`Total Venue: ${totalVenues}`);
    console.log(`Total Lapangan: ${totalFields}`);
    console.log(`Total Reservasi: ${totalBookings}`);
    console.log(`Total Ulasan: ${totalReviews}`);
    console.log("\nDistribusi Reservasi per Tahun (2023 - 2026):");
    for (const row of bookingsByYear) {
        console.log(`  Tahun ${row.year}: ${row.count} booking`);
    }

    console.log("\nContoh Ulasan Autentik:");
    for (const r of sampleReviews) {
        console.log(`  [⭐ ${r.rating}] "${r.comment}" — ${r.field.venue.name} (${r.field.venue.city}) [${r.createdAt.toISOString().split("T")[0]}]`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
