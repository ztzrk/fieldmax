import prisma from "../../src/db";
import { BookingsService } from "../../src/bookings/bookings.service";

async function runConcurrencyTest() {
    console.log("========================================================================");
    console.log("   FIELDMAX - PENGUJIAN KONKURENSI PENCEGAHAN DOUBLE BOOKING (EMPIRIS)");
    console.log("========================================================================\n");

    // 1. Inisialisasi Service (Snap mock fallback jika Midtrans sandbox offline)
    const mockSnap = {
        createTransaction: async () => ({ token: "mock-token-concurrency-test" }),
        transaction: { status: async () => null },
    };
    const bookingsService = new BookingsService(mockSnap as any);

    // 2. Persiapan Data Uji: 2 User & 1 Field
    const users = await prisma.user.findMany({
        take: 2,
        where: { role: "USER" },
        select: { id: true, fullName: true, email: true, phoneNumber: true, role: true },
    });

    if (users.length < 2) {
        console.error("❌ Error: Dibutuhkan minimal 2 pengguna dengan role USER di basis data.");
        return;
    }

    const [userA, userB] = users;

    const field = await prisma.field.findFirst({
        where: {
            status: "APPROVED",
            isClosed: false,
            venue: { status: "APPROVED" },
        },
        include: { venue: true },
    });

    if (!field) {
        console.error("❌ Error: Tidak ditemukan lapangan aktif berstatus APPROVED.");
        return;
    }

    // 3. Tentukan Parameter Slot Uji di Masa Depan
    // Menggunakan tanggal 30 hari ke depan jam 14:00 (durasi 2 jam)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    const bookingDateStr = targetDate.toISOString().split("T")[0] + "T00:00:00.000Z";
    const startTimeStr = "14:00";
    const duration = 2; // 14:00 - 16:00

    console.log("📋 PARAMETER PENGUJIAN:");
    console.log(`- Lapangan        : ${field.name} (${field.venue.name})`);
    console.log(`- Tanggal Booking : ${bookingDateStr.split("T")[0]}`);
    console.log(`- Rentang Jam     : ${startTimeStr} s.d. 16:00 WIB (${duration} jam)`);
    console.log(`- Pemesan 1       : ${userA.fullName} (${userA.email})`);
    console.log(`- Pemesan 2       : ${userB.fullName} (${userB.email})\n`);

    // Bersihkan data uji lama jika ada di slot tersebut
    const cleanStartTime = new Date("1970-01-01T14:00:00.000Z");
    await prisma.booking.deleteMany({
        where: {
            fieldId: field.id,
            bookingDate: new Date(bookingDateStr),
            startTime: cleanStartTime,
        },
    });

    const payload = {
        fieldId: field.id,
        bookingDate: bookingDateStr,
        startTime: startTimeStr,
        duration: duration,
    };

    console.log("🚀 MENGEKSEKUSI 2 REQUEST PEMESANAN SERENTAK (Promise.allSettled)...");
    const timestampStart = new Date().toISOString();
    console.log(`[Waktu Mulai Eksekusi]: ${timestampStart}\n`);

    // 4. Eksekusi Konkuren / Bersamaan di Milidetik yang Sama
    const [resultA, resultB] = await Promise.allSettled([
        bookingsService.createBooking(payload, userA as any),
        bookingsService.createBooking(payload, userB as any),
    ]);

    const timestampEnd = new Date().toISOString();
    console.log(`[Waktu Selesai Eksekusi]: ${timestampEnd}`);
    console.log("------------------------------------------------------------------------");
    console.log("📊 HASIL RESPON SISTEM:");

    let successCount = 0;
    let conflictCount = 0;

    // Evaluasi User A
    if (resultA.status === "fulfilled") {
        successCount++;
        console.log(`✅ [User A - ${userA.fullName}]: BERHASIL`);
        console.log(`   └─ Booking ID : ${resultA.value.booking.id}`);
        console.log(`   └─ Status     : ${resultA.value.booking.status}`);
        console.log(`   └─ Total Bayar: Rp ${resultA.value.booking.totalPrice.toLocaleString("id-ID")}`);
    } else {
        conflictCount++;
        console.log(`❌ [User A - ${userA.fullName}]: DITOLAK (DICEGAH)`);
        console.log(`   └─ Alasan     : ${resultA.reason.message}`);
    }

    // Evaluasi User B
    if (resultB.status === "fulfilled") {
        successCount++;
        console.log(`✅ [User B - ${userB.fullName}]: BERHASIL`);
        console.log(`   └─ Booking ID : ${resultB.value.booking.id}`);
        console.log(`   └─ Status     : ${resultB.value.booking.status}`);
        console.log(`   └─ Total Bayar: Rp ${resultB.value.booking.totalPrice.toLocaleString("id-ID")}`);
    } else {
        conflictCount++;
        console.log(`❌ [User B - ${userB.fullName}]: DITOLAK (DICEGAH)`);
        console.log(`   └─ Alasan     : ${resultB.reason.message}`);
    }

    console.log("------------------------------------------------------------------------");

    // 5. Audit Langsung ke Basis Data (PostgreSQL)
    console.log("\n🔍 MEMERIKSA INTEGRITAS BASIS DATA (SELECT FROM bookings)...");
    const persistedBookings = await prisma.booking.findMany({
        where: {
            fieldId: field.id,
            bookingDate: new Date(bookingDateStr),
            startTime: cleanStartTime,
            status: { in: ["PENDING", "CONFIRMED"] },
        },
        include: { user: { select: { fullName: true, email: true } } },
    });

    console.log(`Total baris booking aktif yang tersimpan di DB: ${persistedBookings.length}`);
    for (const b of persistedBookings) {
        console.log(`- ID: ${b.id} | Pemesan: ${b.user.fullName} | Status: ${b.status} | Dibuat: ${b.createdAt.toISOString()}`);
    }

    console.log("\n========================================================================");
    if (successCount === 1 && conflictCount === 1 && persistedBookings.length === 1) {
        console.log("🏆 KESIMPULAN AUDIT: PENGUJIAN 100% VALID DAN LOLOS!");
        console.log("   Sistem PostgreSQL Serializable Transaction + Prisma terbukti");
        console.log("   mengeliminasi Race Condition dan menjamin ZERO DOUBLE BOOKING.");
    } else {
        console.log("⚠️ KESIMPULAN AUDIT: TERDETEKSI ANOMALI ATAU DOUBLE BOOKING!");
    }
    console.log("========================================================================\n");
}

runConcurrencyTest()
    .catch((err) => {
        console.error("Test execution failed:", err);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
