import prisma from "../db";

export class DashboardService {
    async getAdminStats() {
        const [
            totalUsers,
            totalVenues,
            totalFields,
            pendingVenues,
            recentBookings,
            totalRevenue,
            allChartData,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.venue.count(),
            prisma.field.count(),
            prisma.venue.count({ where: { status: "PENDING" } }),
            prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { fullName: true, email: true } },
                    field: {
                        select: {
                            name: true,
                            venue: { select: { name: true } },
                        },
                    },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: { payment: { status: "PAID" } },
            }),
            this.getAllChartData("ADMIN", ""),
        ]);

        return {
            stats: {
                totalUsers,
                totalVenues,
                totalFields,
                pendingVenues,
                recentBookings,
                totalRevenue: totalRevenue._sum.totalPrice || 0,
            },
            chartData: allChartData,
        };
    }

    async getRenterStats(renterId: string) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0,
            0
        );
        const endOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999
        );

        const [
            totalVenues,
            totalFields,
            activeFieldsCount,
            pendingVenues,
            totalBookings,
            recentBookingsRaw,
            totalRevenue,
            monthlyRevenue,
            todaySchedule,
        ] = await Promise.all([
            prisma.venue.count({ where: { renterId } }),
            prisma.field.count({ where: { venue: { renterId } } }),
            prisma.field.count({
                where: {
                    venue: { renterId },
                    status: "APPROVED",
                    isClosed: false,
                },
            }),
            prisma.venue.count({ where: { renterId, status: "PENDING" } }),
            prisma.booking.count({ where: { field: { venue: { renterId } } } }),
            prisma.booking.findMany({
                take: 6,
                where: { field: { venue: { renterId } } },
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { fullName: true, email: true } },
                    payment: { select: { status: true } },
                    field: {
                        select: {
                            name: true,
                            venue: { select: { name: true } },
                        },
                    },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    field: { venue: { renterId } },
                    payment: { status: "PAID" },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    field: { venue: { renterId } },
                    payment: { status: "PAID" },
                    bookingDate: { gte: startOfMonth },
                },
            }),
            prisma.booking.findMany({
                where: {
                    field: { venue: { renterId } },
                    bookingDate: {
                        gte: startOfToday,
                        lte: endOfToday,
                    },
                    status: {
                        in: ["CONFIRMED", "COMPLETED", "NO_SHOW"],
                    },
                },
                orderBy: { startTime: "asc" },
                take: 10,
                include: {
                    user: { select: { fullName: true, phoneNumber: true } },
                    field: {
                        select: {
                            name: true,
                            venue: { select: { name: true } },
                        },
                    },
                },
            }),
        ]);

        const recentBookings = recentBookingsRaw.map((b) => ({
            ...b,
            paymentStatus: b.payment?.status || "PENDING",
        }));

        const checkedInTodayCount = todaySchedule.filter(
            (b) => b.checkedInAt !== null
        ).length;

        return {
            totalVenues,
            totalFields,
            activeFieldsCount,
            pendingVenues,
            totalBookings,
            recentBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
            todayBookingsCount: todaySchedule.length,
            checkedInTodayCount,
            todaySchedule,
        };
    }
    async getChartData(
        role: string,
        userId: string,
        range: "7d" | "30d" | "12m"
    ) {
        const now = new Date();
        let startDate = new Date();

        if (range === "7d") startDate.setDate(now.getDate() - 7);
        if (range === "30d") startDate.setDate(now.getDate() - 30);
        if (range === "12m") startDate.setMonth(now.getMonth() - 12);

        const where: any = {
            payment: { status: "PAID" },
            bookingDate: { gte: startDate },
        };

        if (role === "RENTER") {
            const renterFields = await prisma.field.findMany({
                where: { venue: { renterId: userId } },
                select: { id: true },
            });
            where.fieldId = { in: renterFields.map((f) => f.id) };
        }

        // Use count aggregation for performance
        // Group by bookingDate to get daily totals directly from DB
        const groupedBookings = await prisma.booking.groupBy({
            by: ["bookingDate"],
            _sum: {
                totalPrice: true,
            },
            where: where,
        });

        const bookings: { bookingDate: Date; totalPrice: number }[] =
            groupedBookings.map((b) => ({
                bookingDate: b.bookingDate,
                totalPrice: b._sum.totalPrice || 0,
            }));

        return this.processChartData(bookings, range);
    }

    async getAllChartData(role: string, userId: string) {
        const now = new Date();
        const startDate = new Date();
        startDate.setMonth(now.getMonth() - 12);

        const where: any = {
            payment: { status: "PAID" },
            bookingDate: { gte: startDate },
        };

        if (role === "RENTER") {
            const renterFields = await prisma.field.findMany({
                where: { venue: { renterId: userId } },
                select: { id: true },
            });
            where.fieldId = { in: renterFields.map((f) => f.id) };
        }

        // Use count aggregation instead of findMany for massive performance boost
        // Group by bookingDate to get daily totals directly from DB
        const groupedBookings = await prisma.booking.groupBy({
            by: ["bookingDate"],
            _sum: {
                totalPrice: true,
            },
            where: where,
        });

        const bookings: { bookingDate: Date; totalPrice: number }[] =
            groupedBookings.map((b) => ({
                bookingDate: b.bookingDate,
                totalPrice: b._sum.totalPrice || 0,
            }));

        return {
            "7d": this.processChartData(bookings, "7d"),
            "30d": this.processChartData(bookings, "30d"),
            "12m": this.processChartData(bookings, "12m"),
        };
    }

    private processChartData(
        bookings: { bookingDate: Date; totalPrice: number }[],
        range: "7d" | "30d" | "12m"
    ) {
        const now = new Date();
        const startDate = new Date();

        if (range === "7d") startDate.setDate(now.getDate() - 7);
        if (range === "30d") startDate.setDate(now.getDate() - 30);
        if (range === "12m") startDate.setMonth(now.getMonth() - 12);

        // Filter bookings for the specific range
        const filteredBookings = bookings.filter(
            (b) => new Date(b.bookingDate) >= startDate
        );

        // Aggregation
        const dataMap = new Map<string, number>();

        // Re-initialize straightforwardly for time ascending order
        if (range === "12m") {
            for (let i = 0; i <= 12; i++) {
                const d = new Date(startDate);
                d.setMonth(startDate.getMonth() + i);
                const key = d.toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                });
                dataMap.set(key, 0);
            }
        } else {
            const days = range === "7d" ? 7 : 30;
            for (let i = 0; i < days; i++) {
                const d = new Date(now);
                d.setDate(now.getDate() - (days - 1 - i));
                const key = d.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                });
                dataMap.set(key, 0);
            }
        }

        filteredBookings.forEach((b) => {
            let key = "";
            if (range === "12m") {
                key = new Date(b.bookingDate).toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                });
            } else {
                key = new Date(b.bookingDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                });
            }

            if (dataMap.has(key)) {
                dataMap.set(key, (dataMap.get(key) || 0) + b.totalPrice);
            }
        });

        return Array.from(dataMap).map(([date, total]) => ({ date, total }));
    }
}
