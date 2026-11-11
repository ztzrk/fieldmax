import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// --- CONFIGURATION ---
type Scale = "SMALL" | "MEDIUM" | "LARGE";

export async function seedSimulation(scale: Scale = "LARGE") {
    const envScale = process.env.SEED_SCALE as Scale;
    const FINAL_SCALE = envScale || scale;

    const CONFIG = {
        SMALL: {
            customers: 25,
            renters: 8,
            venuesPerRenter: { min: 1, max: 2 },
            fieldsPerVenue: { min: 2, max: 3 },
            bookingsPerField: { min: 5, max: 12 },
            reports: 12,
        },
        MEDIUM: {
            customers: 100,
            renters: 30,
            venuesPerRenter: { min: 2, max: 4 },
            fieldsPerVenue: { min: 3, max: 5 },
            bookingsPerField: { min: 20, max: 45 },
            reports: 40,
        },
        LARGE: {
            customers: 400,
            renters: 80,
            venuesPerRenter: { min: 2, max: 5 },
            fieldsPerVenue: { min: 3, max: 6 },
            bookingsPerField: { min: 40, max: 100 },
            reports: 120,
        },
    };

    const SETTINGS = CONFIG[FINAL_SCALE];

    console.log(`\n🚀 MEMULAI SEED SIMULASI FIELDMAX [SKALA: ${FINAL_SCALE}]`);
    console.log(`   - Pelanggan (Users): ${SETTINGS.customers}`);
    console.log(`   - Mitra Pengelola (Renters): ${SETTINGS.renters}`);
    console.log(`   - Estimasi Venue: ${SETTINGS.renters * 2}`);
    console.log(`   - Estimasi Booking: Ribuan transaksi dinamis...\n`);

    // --- DATA CONSTANTS (LOCALIZED INDONESIA) ---

    const idFirstNames = [
        "Andi", "Muhammad", "Ahmad", "Budi", "Rizky", "Fajar", "Dimas", "Bayu",
        "Hendra", "Ilham", "Wahyu", "Aditya", "Putra", "Reza", "Farhan", "Rian",
        "Siti", "Nur", "Dewi", "Putri", "Anisa", "Rina", "Maya", "Fitri", "Indah",
        "Tari", "Mega", "Dian", "Ayu", "Nurlina", "Taufik", "Zul", "Fikri", "Hafiz"
    ];

    const idLastNames = [
        "Pratama", "Saputra", "Wijaya", "Hidayat", "Santoso", "Kusuma", "Wibowo",
        "Nugroho", "Firmansyah", "Siregar", "Nasution", "Lubis", "Pasaribu", "Harahap",
        "Pattimura", "Makmur", "Syam", "Mappasere", "Bachtiar", "Sulaeman", "Gunawan",
        "Kurniawan", "Setiawan", "Utomo", "Ramadhan", "Mustofa", "Subagyo", "Alamsyah"
    ];

    const idCompanyPrefixes = [
        "PT", "CV", "GOR", "Klub", "Sentra Olahraga"
    ];

    const idCompanyNames = [
        "Bintang Sport Nusantara", "Juara Bersama Perkasa", "Prima Sejahtera Sport",
        "Kencana Olahraga Mandiri", "Cahaya Bugar Abadi", "Garuda Sportindo Utama",
        "Makassar Futsal Zone", "Celebes Sport Arena", "Nusantara Mini Soccer",
        "Andalas Champion Hub", "Sultan Sport Complex", "Panakkukang Athletic Club",
        "Jawa Sportindo Jaya", "Khatulistiwa Sport Center", "Pahlawan Arena Mandiri"
    ];

    const idStreetNames = [
        "Jl. Perintis Kemerdekaan", "Jl. AP Pettarani", "Jl. Urip Sumoharjo",
        "Jl. Boulevard Panakkukang", "Jl. Sultan Alauddin", "Jl. Jenderal Sudirman",
        "Jl. Gatot Subroto", "Jl. Dago Asri", "Jl. HR Muhammad", "Jl. Malioboro",
        "Jl. Sunset Road", "Jl. Gajah Mada", "Jl. Diponegoro", "Jl. Pemuda",
        "Jl. Ratulangi", "Jl. Pengayoman", "Jl. Hertasning"
    ];

    const cities = [
        {
            name: "Makassar",
            province: "Sulawesi Selatan",
            districts: [
                "Tamalanrea",
                "Panakkukang",
                "Bontoala",
                "Ujung Pandang",
                "Rappocini",
                "Manggala",
                "Mariso",
            ],
        },
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

    const idReviewTemplates = [
        // Bintang 5
        { text: "Lapangan sangat bagus, rumput sintetisnya empuk dan bersih banget. Pasti bakal sewa lagi!", rating: 5 },
        { text: "Penerangan malam hari terang benderang. Parkiran luas, toilet bersih, adminnya juga sangat ramah.", rating: 5 },
        { text: "Fasilitas lengkap ada mushola dan kantin. Suasana main enak banget bareng teman-teman.", rating: 5 },
        { text: "Kualitas karpet lapangan badminton luar biasa, tidak licin sama sekali. Mantap!", rating: 5 },
        { text: "Tempat favorit tim kami untuk sparring mingguan. Sangat direkomendasikan!", rating: 5 },
        { text: "Pelayanan profesional, proses check-in cepat lewat aplikasi FieldMax tanpa ribet.", rating: 5 },
        { text: "Jaring gawang dan garis lapangan sangat terawat. Main futsal jadi makin seru!", rating: 5 },
        // Bintang 4
        { text: "Lapangan bagus dan terawat. Hanya saja parkiran mobil agak padat kalau weekend.", rating: 4 },
        { text: "Secara umum nyaman, ruang ganti bersih. Harganya cukup bersahabat untuk mahasiswa.", rating: 4 },
        { text: "Lampu lapangan cukup terang, cuma sirkulasi udara pas main siang hari agak hangat.", rating: 4 },
        { text: "Fasilitas oke, bola dan rompi sewaannya dalam kondisi bersih dan wangi.", rating: 4 },
        { text: "Akses lokasi strategis di pinggir jalan utama, lapangan rata dan nyaman untuk lari.", rating: 4 },
        // Bintang 3
        { text: "Lapangan lumayan oke untuk main santai, tapi toiletnya perlu lebih sering dibersihkan.", rating: 3 },
        { text: "Garis lapangannya agak mulai pudar, semoga pihak pengelola segera mengecat ulang.", rating: 3 },
        { text: "Standar saja, harga sebanding dengan fasilitas yang didapat. Cukup lumayan.", rating: 3 },
        // Bintang 2
        { text: "Lantai lapangan agak licin di bagian dekat garis pinggir. Tolong diperhatikan keselamatannya.", rating: 2 },
        { text: "Parkirannya susah banget dan penjaga parkir kurang ramah saat diarahkan.", rating: 2 },
        // Bintang 1
        { text: "Jadwal sempat tertunda karena tim sebelumnya molor dan tidak ditegur. Mohon ketegasannya.", rating: 1 },
    ];

    // --- HELPERS ---
    const pickRandom = <T>(arr: T[]): T =>
        arr[Math.floor(Math.random() * arr.length)];
    const randomInt = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    // Realistic Indonesian Prime-Time Slot Generator
    const getRealisticTimeSlot = () => {
        const roll = Math.random();
        let startH: number;
        if (roll < 0.65) {
            // Prime-time: Sore hingga malam (16:00 - 21:00)
            startH = pickRandom([16, 17, 18, 19, 20, 21]);
        } else if (roll < 0.88) {
            // Pagi hari (07:00 - 11:00)
            startH = pickRandom([7, 8, 9, 10, 11]);
        } else {
            // Siang hari (13:00 - 15:00)
            startH = pickRandom([13, 14, 15]);
        }
        // Durasi 1 atau 2 jam (tidak melewati jam 22:00)
        const duration = startH >= 21 ? 1 : Math.random() < 0.6 ? 1 : 2;
        return { startH, duration };
    };

    // Parallel Chunk Processor
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
            process.stdout.write(`.`);
        }
    }

    // 1. CLEANUP
    console.log("🧹 Membersihkan data lama...");
    try {
        await prisma.review.deleteMany({});
        await prisma.payment.deleteMany({});
        await prisma.booking.deleteMany({});
        await prisma.fieldPhoto.deleteMany({});
        await prisma.venuePhoto.deleteMany({});
        await prisma.field.deleteMany({});
        await prisma.venueSchedule.deleteMany({});
        await prisma.venue.deleteMany({});
        await prisma.userProfile.deleteMany({});
        await prisma.reportReply.deleteMany({});
        await prisma.report.deleteMany({});
        await prisma.user.deleteMany({ where: { role: { not: "ADMIN" } } });
        console.log("✅ Pembersihan selesai.\n");
    } catch (e: any) {
        console.log("ℹ️ Pembersihan parsial: " + e.message);
    }

    // 2. ENSURE SPORT TYPES
    let allSportTypes = await prisma.sportType.findMany();
    if (allSportTypes.length === 0) {
        console.log("⚠️ Mengisi data jenis olahraga default...");
        const defaults = [
            "Futsal",
            "Badminton",
            "Mini Soccer",
            "Basketball",
            "Tennis",
            "Volleyball",
            "Table Tennis",
            "Swimming",
            "Gym & Fitness",
            "Squash",
        ];
        for (const name of defaults) {
            await prisma.sportType.create({ data: { name } });
        }
        allSportTypes = await prisma.sportType.findMany();
    }

    const hashedPassword = await bcrypt.hash("password", 10);

    // 3. ENSURE ADMIN & CREATE CUSTOMERS (INDONESIAN NAMES)
    const adminEmail = "admin@example.com";
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                email: adminEmail,
                fullName: "Super Admin FieldMax",
                phoneNumber: "081198765432",
                password: hashedPassword,
                role: "ADMIN",
                isVerified: true,
            },
        });
        console.log("✅ Admin Created.");
    }

    console.log(`👤 Membuat ${SETTINGS.customers} Pelanggan (Users)...`);
    const usedEmails = new Set<string>();
    const customerData = Array.from({ length: SETTINGS.customers }).map(
        (_, i) => {
            const firstName = pickRandom(idFirstNames);
            const lastName = pickRandom(idLastNames);
            let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(10, 9999)}@gmail.com`;
            while (usedEmails.has(email)) {
                email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(10, 99999)}@gmail.com`;
            }
            usedEmails.add(email);

            // Akun dibuat tersebar dari awal 2023 hingga 2026
            const userDaysAgo = randomInt(15, 1420);
            const userCreatedAt = new Date(Date.now() - userDaysAgo * 24 * 60 * 60 * 1000);

            return {
                email: email,
                fullName: `${firstName} ${lastName}`,
                phoneNumber: `08${pickRandom(["12", "13", "21", "22", "52", "53"])}${randomInt(10000000, 99999999)}`,
                password: hashedPassword,
                role: "USER" as UserRole,
                isVerified: true,
                createdAt: userCreatedAt,
            };
        }
    );
    await prisma.user.createMany({ data: customerData });
    const customers = await prisma.user.findMany({ where: { role: "USER" } });
    console.log(`✅ Pelanggan berhasil dibuat.\n`);

    // 4. PROCESS RENTERS (INDONESIAN IDENTITIES)
    console.log(
        `🏢 Memproses ${SETTINGS.renters} Mitra Pengelola (Parallel Batches)...`
    );

    const rentersToCreate = Array.from({ length: SETTINGS.renters }).map(
        (_, i) => i
    );

    let totalVenues = 0;
    let totalBookings = 0;

    await processInChunks(rentersToCreate, 10, async () => {
        const firstName = pickRandom(idFirstNames);
        const lastName = pickRandom(idLastNames);
        const randId = randomInt(100, 9999);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randId}@renter.fieldmax.id`;
        const companyName = `${pickRandom(idCompanyPrefixes)} ${pickRandom(idCompanyNames)}`;
        const cityObj = pickRandom(cities);
        const district = pickRandom(cityObj.districts);

        // Mitra bergabung sejak 2023 - 2025
        const renterDaysAgo = randomInt(180, 1430);
        const renterCreatedAt = new Date(Date.now() - renterDaysAgo * 24 * 60 * 60 * 1000);

        // Create Renter + Profile
        const renter = await prisma.user.create({
            data: {
                email: email,
                fullName: `${firstName} ${lastName}`,
                phoneNumber: `08${pickRandom(["11", "12", "13", "52", "53"])}${randomInt(10000000, 99999999)}`,
                password: hashedPassword,
                role: "RENTER",
                isVerified: true,
                createdAt: renterCreatedAt,
                profile: {
                    create: {
                        companyName: companyName,
                        companyDescription: `Pengelola fasilitas olahraga resmi dan modern di ${cityObj.name}. Berkomitmen menyediakan sarana olahraga berkualitas tinggi.`,
                        companyWebsite: `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.co.id`,
                        address: `${pickRandom(idStreetNames)} No. ${randomInt(1, 150)}, ${district}, ${cityObj.name}`,
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
            const vPrefix = pickRandom(["GOR", "Arena", "Sport Center", "Futsal Zone", "Klub Olahraga"]);
            const cleanCompany = companyName.replace(/^(PT|CV|GOR|Klub)\s+/, "");
            const venueName = `${vPrefix} ${cleanCompany} ${district}`;

            // Venue dibuat tak lama setelah mitra mendaftar
            const venueCreatedAt = new Date(renterCreatedAt.getTime() + randomInt(2, 20) * 24 * 60 * 60 * 1000);

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
                    address: `${pickRandom(idStreetNames)} No. ${randomInt(1, 190)}`,
                    city: cityObj.name,
                    district: district,
                    province: cityObj.province,
                    postalCode: `${randomInt(10000, 99999)}`,
                    description: `Pusat fasilitas olahraga terpadu di kawasan ${district}, ${cityObj.name}. Menyediakan lapangan berkualitas standar turnamen dengan pencahayaan malam yang terang, fasilitas parkir luas, ruang ganti bersih, dan kantin.`,
                    renterId: renter.id,
                    status: status,
                    createdAt: venueCreatedAt,
                    rejectionReason:
                        status === "REJECTED"
                            ? "Foto fasilitas kurang jelas dan jam operasional belum lengkap."
                            : null,
                    schedules: {
                        create: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
                            dayOfWeek: day,
                            openTime: new Date("1970-01-01T07:00:00.000Z"),
                            closeTime: new Date("1970-01-01T22:00:00.000Z"),
                        })),
                    },
                    photos: {
                        create: [
                            { url: pickRandom(photos), isFeatured: true },
                            { url: pickRandom(photos), isFeatured: false },
                        ],
                    },
                },
            });

            if (status !== "APPROVED") continue;

            // Generate Fields
            const numFields = randomInt(
                SETTINGS.fieldsPerVenue.min,
                SETTINGS.fieldsPerVenue.max
            );
            for (let k = 0; k < numFields; k++) {
                const sport = pickRandom(allSportTypes);
                const fieldName = `Lapangan ${sport.name} ${k + 1}`;

                // Tarif sewa realistis: Rp 50.000 s/d Rp 200.000 / jam
                const pricePerHour = randomInt(5, 20) * 10000;
                const fieldCreatedAt = new Date(venueCreatedAt.getTime() + randomInt(1, 10) * 24 * 60 * 60 * 1000);

                const field = await prisma.field.create({
                    data: {
                        venueId: venue.id,
                        name: fieldName,
                        description: `Lapangan ${sport.name} dengan lantai dan pencahayaan standar kompetisi, cocok untuk latihan rutin dan pertandingan persahabatan.`,
                        pricePerHour: pricePerHour,
                        sportTypeId: sport.id,
                        status: "APPROVED",
                        isClosed: Math.random() < 0.02,
                        createdAt: fieldCreatedAt,
                        photos: {
                            create: [
                                { url: pickRandom(photos), isFeatured: true },
                            ],
                        },
                    },
                });

                // Generate Bookings with Realistic Prime-Time Slots across 2023 - 2026
                const numBookings = randomInt(
                    SETTINGS.bookingsPerField.min,
                    SETTINGS.bookingsPerField.max
                );

                const bookingPromises = [];

                for (let b = 0; b < numBookings; b++) {
                    const customer = pickRandom(customers);
                    if (!customer) continue;

                    // Persebaran waktu dari Januari 2023 (~1400 hari yang lalu) hingga +30 hari ke depan
                    const daysAgoMax = 1400;
                    const u = Math.random();
                    // Pemodelan pertumbuhan (distribusi polinomial: volume reservasi bertumbuh dari 2023 ke 2026)
                    const daysOffset = Math.round(25 - Math.pow(u, 1.25) * (daysAgoMax + 25));

                    const bookingDate = new Date();
                    bookingDate.setDate(bookingDate.getDate() + daysOffset);
                    bookingDate.setHours(0, 0, 0, 0);

                    // Dynamic Realistic Time Slot (16:00, 18:00, 19:00, 20:00 dll)
                    const { startH, duration } = getRealisticTimeSlot();
                    const startHStr = startH.toString().padStart(2, "0");
                    const endHStr = (startH + duration).toString().padStart(2, "0");

                    const startTime = new Date(`1970-01-01T${startHStr}:00:00.000Z`);
                    const endTime = new Date(`1970-01-01T${endHStr}:00:00.000Z`);
                    const totalPrice = pricePerHour * duration;

                    // Reservasi dilakukan 1-7 hari sebelum tanggal main
                    const advanceDays = randomInt(1, 7);
                    const bookingCreatedAt = new Date(bookingDate.getTime() - advanceDays * 24 * 60 * 60 * 1000);

                    let bStatus = "PENDING";
                    let pStatus = "PENDING";
                    const isPast = daysOffset < 0;

                    if (isPast) {
                        const r = Math.random();
                        if (r < 0.84) {
                            bStatus = "COMPLETED";
                            pStatus = "PAID";
                        } else if (r < 0.93) {
                            bStatus = "CANCELLED";
                            pStatus = "FAILED";
                        } else {
                            bStatus = "PENDING";
                        }
                    } else {
                        const r = Math.random();
                        if (r < 0.68) {
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
                        startTime: startTime,
                        endTime: endTime,
                        totalPrice: totalPrice,
                        status: bStatus as any,
                        createdAt: bookingCreatedAt,
                        payment: {
                            create: {
                                amount: totalPrice,
                                status: pStatus as any,
                                createdAt: bookingCreatedAt,
                                updatedAt: bStatus === "COMPLETED" || bStatus === "CONFIRMED"
                                    ? new Date(bookingCreatedAt.getTime() + 5 * 60 * 1000)
                                    : bookingCreatedAt,
                            },
                        },
                    };

                    // Add Review if Completed (Bahasa Indonesia)
                    if (bStatus === "COMPLETED" && Math.random() < 0.5) {
                        const tmpl = pickRandom(idReviewTemplates);
                        const reviewCreatedAt = new Date(
                            bookingDate.getTime() + (startH + duration + randomInt(1, 24)) * 60 * 60 * 1000
                        );
                        bookingData.review = {
                            create: {
                                userId: customer.id,
                                fieldId: field.id,
                                rating: tmpl.rating,
                                comment: tmpl.text,
                                createdAt: reviewCreatedAt,
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

    // 5. GENERATE REPORTS (INDONESIAN SCENARIOS)
    console.log(`\n📄 Membuat ${SETTINGS.reports} Laporan Masalah (Bahasa Indonesia)...`);
    const adminUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    const reportCategories = ["SCAM", "TECHNICAL", "PAYMENT", "OTHER"];

    const reportTemplates: Record<
        string,
        { subject: string; description: string }[]
    > = {
        SCAM: [
            {
                subject: "Pengelola meminta biaya tambahan lampu malam",
                description:
                    "Saat tiba di lokasi, penjaga lapangan meminta tambahan biaya Rp 50.000 untuk lampu malam, padahal di FieldMax sudah bayar lunas.",
            },
            {
                subject: "Alamat venue fiktif atau tidak ditemukan",
                description:
                    "Saya mendatangi lokasi sesuai alamat tetapi tidak ada lapangan olahraga, hanya lahan ruko kosong.",
            },
            {
                subject: "Penolakan pembatalan jadwal sepihak",
                description:
                    "Pihak venue menolak membatalkan reservasi meskipun saya membatalkan sesuai batas waktu yang diperbolehkan.",
            },
            {
                subject: "Foto lapangan tidak sesuai kenyataan",
                description:
                    "Foto di aplikasi terlihat baru, tapi saat datang rumput sintetisnya sudah banyak yang botak dan licin.",
            },
        ],
        TECHNICAL: [
            {
                subject: "Aplikasi lambat saat konfirmasi pembayaran",
                description:
                    "Halaman checkout sempat loading lama beberapa detik setelah QRIS selesai dibayar melalui m-banking.",
            },
            {
                subject: "Jadwal booking tidak langsung terupdate",
                description:
                    "Setelah pembayaran berhasil, status di tiket masih pending beberapa saat sebelum berubah confirmed.",
            },
            {
                subject: "Pencarian lapangan di kota saya tidak muncul",
                description:
                    "Saya mencari kata kunci 'Futsal' di filter kota Makassar namun hasil pencarian sempat kosong.",
            },
            {
                subject: "Gagal memuat ulang halaman detail lapangan",
                description:
                    "Halaman detail lapangan sempat menampilkan error saat koneksi internet saya sedikit tidak stabil.",
            },
        ],
        PAYMENT: [
            {
                subject: "Saldo bank terpotong dua kali",
                description:
                    "Saya melihat mutasi rekening terpotong dua kali untuk pesanan reservasi yang sama.",
            },
            {
                subject: "Status pembayaran failed tetapi saldo berkurang",
                description:
                    "Aplikasi sempat menampilkan status gagal saat timeout, namun saldo dompet digital saya sudah terpotong.",
            },
            {
                subject: "Konfirmasi pengembalian dana pembatalan",
                description:
                    "Saya sudah mengajukan pembatalan pesanan 3 hari yang lalu, mohon dibantu konfirmasi status refund.",
            },
            {
                subject: "Metode pembayaran Virtual Account terkendala",
                description:
                    "Nomor Virtual Account yang digenerate sempat tidak dapat dibayar melalui ATM karena nomor tidak ditemukan.",
            },
        ],
        OTHER: [
            {
                subject: "Fasilitas ruang ganti dan toilet kotor",
                description:
                    "Air di toilet pria mati saat sesi sewa malam hari, dan ruang ganti kurang terawat.",
            },
            {
                subject: "Sikap penjaga lapangan kurang ramah",
                description:
                    "Staf lapangan kurang kooperatif saat kami menanyakan kunci loker dan ketersediaan bola sewa.",
            },
            {
                subject: "Saran penambahan filter indoor / outdoor",
                description:
                    "Akan sangat bermanfaat jika ke depannya ada opsi filter untuk lapangan yang memiliki atap tertutup (indoor) dan terbuka.",
            },
            {
                subject: "Titik lokasi peta kurang presisi",
                description:
                    "Titik pin lokasi GPS bergeser sekitar 200 meter dari gerbang masuk utama venue.",
            },
        ],
    };

    const adminReplies = [
        "Terima kasih atas laporannya. Tim operasional FieldMax telah menghubungi pihak pengelola venue untuk menindaklanjuti hal ini.",
        "Laporan Anda telah kami verifikasi dan transaksi telah diselesaikan dengan sukses. Mohon maaf atas kendala yang terjadi.",
        "Kami telah menegur pihak pengelola venue terkait standar pelayanan dan kebersihan fasilitas.",
        "Mohon lampirkan bukti nomor transaksi atau screenshot bukti transfer agar tim keuangan kami dapat memproses pengecekan lebih lanjut.",
        "Kendala teknis ini telah berhasil diselesaikan oleh tim pengembang kami. Terima kasih atas masukan berharga Anda.",
        "Kami memohon maaf atas ketidaknyamanan yang Anda alami. Tiket laporan ini telah ditandai sebagai Selesai.",
    ];

    for (let i = 0; i < SETTINGS.reports; i++) {
        const reporter = pickRandom(customers);
        if (!reporter) continue;

        const category = pickRandom(reportCategories);
        const templates = reportTemplates[category] || reportTemplates["OTHER"];
        const template = pickRandom(templates);

        const isResolved = Math.random() > 0.6;
        const status = isResolved ? "RESOLVED" : "PENDING";
        const variation = ` [No. Tiket: FMX-${randomInt(1000, 9999)}]`;

        await prisma.report.create({
            data: {
                userId: reporter.id,
                subject: template.subject,
                description: template.description + variation,
                category: category as any,
                status: status as any,
                replies:
                    isResolved && adminUser && Math.random() > 0.2
                        ? {
                              create: {
                                  senderId: adminUser.id,
                                  message: pickRandom(adminReplies),
                              },
                          }
                        : undefined,
            },
        });
    }

    console.log(`\n\n✅ SEEDING SIMULASI SELESAI DENGAN SUKSES!`);
    console.log(`   - Total Venue: ${totalVenues}`);
    console.log(`   - Total Booking: ${totalBookings}`);
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
