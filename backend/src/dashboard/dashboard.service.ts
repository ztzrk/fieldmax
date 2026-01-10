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
        ]);

        return {
            totalUsers,
            totalVenues,
            totalFields,
            pendingVenues,
            recentBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
        };
    }

    async getRenterStats(renterId: string) {
        const [
            totalVenues,
            totalFields,
            pendingVenues,
            totalBookings,
            recentBookings,
            totalRevenue,
        ] = await Promise.all([
            prisma.venue.count({ where: { renterId } }),
            prisma.field.count({ where: { venue: { renterId } } }),
            prisma.venue.count({ where: { renterId, status: "PENDING" } }),
            prisma.booking.count({ where: { field: { venue: { renterId } } } }),
            prisma.booking.findMany({
                take: 5,
                where: { field: { venue: { renterId } } },
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
                where: {
                    field: { venue: { renterId } },
                    payment: { status: "PAID" },
                },
            }),
        ]);

        return {
            totalVenues,
            totalFields,
            pendingVenues,
            totalBookings,
            recentBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
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
            paymentStatus: "PAID",
            bookingDate: { gte: startDate },
        };

        if (role === "RENTER") {
            where.field = { venue: { renterId: userId } };
        }

        const bookings = await prisma.booking.findMany({
            where,
            select: { bookingDate: true, totalPrice: true },
            orderBy: { bookingDate: "asc" },
        });

        // Aggregation
        const dataMap = new Map<string, number>();

        // Initialize map with empty values
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
            for (let i = 0; i <= days; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                const key = d.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                }); // 25 Jan
                dataMap.set(key, 0);
            }
        }

        bookings.forEach((b) => {
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
            } else {
                dataMap.set(key, (dataMap.get(key) || 0) + b.totalPrice);
            }
        });

        return Array.from(dataMap).map(([date, total]) => ({ date, total }));
    }
}
