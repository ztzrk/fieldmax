import prisma from "../db";

const MONTH_LABELS_ID = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
];

type ChartRange = "7d" | "30d" | "12m";

interface ChartBucketInput {
    bookingDate: Date;
    totalPrice: number;
    count: number;
}

export interface ChartPoint {
    date: string;
    total: number;
    count: number;
}

/**
 * Formats a UTC Date (e.g. Postgres @db.Date) into YYYY-MM-DD key.
 */
function toUtcDateKey(d: Date): string {
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Formats YYYY-MM key for 12-month buckets.
 */
function toYearMonthKey(year: number, monthIndex: number): string {
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

/**
 * Computes month-over-month percentage change when previous > 0.
 */
function computeDeltaPercentage(
    current: number,
    previous: number
): number | null {
    if (previous <= 0) return null;
    return Number((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Returns WIB (UTC+7) anchored calendar boundaries for today & months.
 */
function getDashboardCalendarBounds() {
    const wibOffsetMs = 7 * 60 * 60 * 1000;
    const wibNow = new Date(Date.now() + wibOffsetMs);
    const year = wibNow.getUTCFullYear();
    const month = wibNow.getUTCMonth();
    const day = wibNow.getUTCDate();

    const startOfTodayUtc = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const endOfTodayUtc = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

    const startOfThisMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const startOfLastMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endOfLastMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    return {
        year,
        month,
        day,
        startOfTodayUtc,
        endOfTodayUtc,
        startOfThisMonth,
        startOfLastMonth,
        endOfLastMonth,
    };
}

export class DashboardService {
    async getAdminStats() {
        const {
            startOfTodayUtc,
            endOfTodayUtc,
            startOfThisMonth,
            startOfLastMonth,
            endOfLastMonth,
        } = getDashboardCalendarBounds();

        const [
            totalUsers,
            rentersCount,
            regularUsersCount,
            newUsersThisMonth,
            newUsersLastMonth,
            totalVenues,
            approvedVenues,
            pendingVenues,
            totalFields,
            activeFields,
            pendingFields,
            openReports,
            totalBookings,
            todayBookingsCount,
            bookingsThisMonth,
            bookingsLastMonth,
            totalRevenueAgg,
            monthlyRevenueAgg,
            lastMonthRevenueAgg,
            bookingStatusGroup,
            recentBookingsRaw,
            allChartData,
            sportTypesRaw,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: "RENTER" } }),
            prisma.user.count({ where: { role: "USER" } }),
            prisma.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prisma.user.count({
                where: {
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),
            prisma.venue.count(),
            prisma.venue.count({ where: { status: "APPROVED" } }),
            prisma.venue.count({ where: { status: "PENDING" } }),
            prisma.field.count(),
            prisma.field.count({
                where: { status: "APPROVED", isClosed: false },
            }),
            prisma.field.count({ where: { status: "PENDING" } }),
            prisma.report.count({
                where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
            }),
            prisma.booking.count(),
            prisma.booking.count({
                where: {
                    bookingDate: { gte: startOfTodayUtc, lte: endOfTodayUtc },
                    status: { in: ["CONFIRMED", "COMPLETED", "PENDING"] },
                },
            }),
            prisma.booking.count({
                where: { createdAt: { gte: startOfThisMonth } },
            }),
            prisma.booking.count({
                where: {
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: { payment: { status: "PAID" } },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    payment: { status: "PAID" },
                    bookingDate: { gte: startOfThisMonth },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    payment: { status: "PAID" },
                    bookingDate: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),
            prisma.booking.groupBy({
                by: ["status"],
                _count: { id: true },
            }),
            prisma.booking.findMany({
                take: 6,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { fullName: true, email: true } },
                    payment: { select: { status: true } },
                    field: {
                        select: {
                            name: true,
                            venue: { select: { id: true, name: true } },
                        },
                    },
                },
            }),
            this.getAllChartData("ADMIN", ""),
            prisma.sportType.findMany({
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            fields: { where: { status: "APPROVED" } },
                        },
                    },
                },
                orderBy: {
                    fields: { _count: "desc" },
                },
                take: 5,
            }),
        ]);

        const recentBookings = recentBookingsRaw.map((b) => ({
            ...b,
            paymentStatus: b.payment?.status || "PENDING",
        }));

        const totalRevenue = totalRevenueAgg._sum.totalPrice || 0;
        const monthlyRevenue = monthlyRevenueAgg._sum.totalPrice || 0;
        const lastMonthRevenue = lastMonthRevenueAgg._sum.totalPrice || 0;

        const bookingStatusBreakdown = bookingStatusGroup.map((row) => ({
            status: row.status,
            count: row._count.id,
        }));

        const topSportTypes = sportTypesRaw.map((sport) => ({
            id: sport.id,
            name: sport.name,
            fieldCount: sport._count.fields,
        }));

        return {
            stats: {
                totalUsers,
                rentersCount,
                regularUsersCount,
                newUsersThisMonth,
                userDeltaPct: computeDeltaPercentage(
                    newUsersThisMonth,
                    newUsersLastMonth
                ),
                totalVenues,
                approvedVenues,
                pendingVenues,
                totalFields,
                activeFields,
                pendingFields,
                openReports,
                totalBookings,
                todayBookingsCount,
                bookingsThisMonth,
                bookingDeltaPct: computeDeltaPercentage(
                    bookingsThisMonth,
                    bookingsLastMonth
                ),
                totalRevenue,
                monthlyRevenue,
                lastMonthRevenue,
                revenueDeltaPct: computeDeltaPercentage(
                    monthlyRevenue,
                    lastMonthRevenue
                ),
                bookingStatusBreakdown,
                topSportTypes,
                recentBookings,
            },
            chartData: allChartData,
        };
    }

    async getRenterStats(renterId: string) {
        const {
            startOfTodayUtc,
            endOfTodayUtc,
            startOfThisMonth,
            startOfLastMonth,
            endOfLastMonth,
        } = getDashboardCalendarBounds();

        const [
            totalVenues,
            approvedVenues,
            pendingVenues,
            rejectedVenues,
            totalFields,
            activeFieldsCount,
            pendingFields,
            rejectedFields,
            openReports,
            totalBookings,
            bookingsThisMonth,
            bookingsLastMonth,
            recentBookingsRaw,
            totalRevenueAgg,
            monthlyRevenueAgg,
            lastMonthRevenueAgg,
            todaySchedule,
            reviewSummary,
            renterFieldsRaw,
        ] = await Promise.all([
            prisma.venue.count({ where: { renterId } }),
            prisma.venue.count({ where: { renterId, status: "APPROVED" } }),
            prisma.venue.count({ where: { renterId, status: "PENDING" } }),
            prisma.venue.count({ where: { renterId, status: "REJECTED" } }),
            prisma.field.count({ where: { venue: { renterId } } }),
            prisma.field.count({
                where: {
                    venue: { renterId },
                    status: "APPROVED",
                    isClosed: false,
                },
            }),
            prisma.field.count({
                where: { venue: { renterId }, status: "PENDING" },
            }),
            prisma.field.count({
                where: { venue: { renterId }, status: "REJECTED" },
            }),
            prisma.report.count({
                where: {
                    userId: renterId,
                    status: { in: ["PENDING", "IN_PROGRESS"] },
                },
            }),
            prisma.booking.count({ where: { field: { venue: { renterId } } } }),
            prisma.booking.count({
                where: {
                    field: { venue: { renterId } },
                    createdAt: { gte: startOfThisMonth },
                },
            }),
            prisma.booking.count({
                where: {
                    field: { venue: { renterId } },
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),
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
                            venue: { select: { id: true, name: true } },
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
                    bookingDate: { gte: startOfThisMonth },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    field: { venue: { renterId } },
                    payment: { status: "PAID" },
                    bookingDate: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
            }),
            prisma.booking.findMany({
                where: {
                    field: { venue: { renterId } },
                    bookingDate: {
                        gte: startOfTodayUtc,
                        lte: endOfTodayUtc,
                    },
                    status: {
                        in: ["CONFIRMED", "COMPLETED", "NO_SHOW"],
                    },
                },
                orderBy: { startTime: "asc" },
                take: 12,
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
            prisma.review.aggregate({
                _avg: { rating: true },
                _count: { id: true },
                where: { field: { venue: { renterId } } },
            }),
            prisma.field.findMany({
                where: { venue: { renterId } },
                select: {
                    id: true,
                    name: true,
                    isClosed: true,
                    status: true,
                    pricePerHour: true,
                    venue: { select: { id: true, name: true } },
                    bookings: {
                        where: { payment: { status: "PAID" } },
                        select: { totalPrice: true },
                    },
                    reviews: {
                        select: { rating: true },
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

        const monthlyRevenue = monthlyRevenueAgg._sum.totalPrice || 0;
        const lastMonthRevenue = lastMonthRevenueAgg._sum.totalPrice || 0;

        const topFields = renterFieldsRaw
            .map((field) => {
                const revenue = field.bookings.reduce(
                    (sum, b) => sum + b.totalPrice,
                    0
                );
                const reviewCount = field.reviews.length;
                const avgRating =
                    reviewCount > 0
                        ? Number(
                              (
                                  field.reviews.reduce(
                                      (acc, r) => acc + r.rating,
                                      0
                                  ) / reviewCount
                              ).toFixed(1)
                          )
                        : 0;
                return {
                    id: field.id,
                    name: field.name,
                    venueId: field.venue.id,
                    venueName: field.venue.name,
                    isClosed: field.isClosed,
                    status: field.status,
                    pricePerHour: field.pricePerHour,
                    bookingCount: field.bookings.length,
                    revenue,
                    avgRating,
                    reviewCount,
                };
            })
            .sort((a, b) => b.revenue - a.revenue || b.bookingCount - a.bookingCount)
            .slice(0, 4);

        return {
            totalVenues,
            approvedVenues,
            pendingVenues,
            rejectedVenues,
            totalFields,
            activeFieldsCount,
            pendingFields,
            rejectedFields,
            openReports,
            totalBookings,
            bookingsThisMonth,
            bookingDeltaPct: computeDeltaPercentage(
                bookingsThisMonth,
                bookingsLastMonth
            ),
            recentBookings,
            totalRevenue: totalRevenueAgg._sum.totalPrice || 0,
            monthlyRevenue,
            lastMonthRevenue,
            revenueDeltaPct: computeDeltaPercentage(
                monthlyRevenue,
                lastMonthRevenue
            ),
            averageRating: reviewSummary._avg.rating
                ? Number(reviewSummary._avg.rating.toFixed(1))
                : 0,
            totalReviews: reviewSummary._count.id || 0,
            todayBookingsCount: todaySchedule.length,
            checkedInTodayCount,
            todaySchedule,
            topFields,
        };
    }

    async getChartData(role: string, userId: string, range: ChartRange) {
        const { year, month, day } = getDashboardCalendarBounds();
        let startDate: Date;

        if (range === "7d") {
            startDate = new Date(Date.UTC(year, month, day - 6, 0, 0, 0, 0));
        } else if (range === "30d") {
            startDate = new Date(Date.UTC(year, month, day - 29, 0, 0, 0, 0));
        } else {
            startDate = new Date(Date.UTC(year, month - 11, 1, 0, 0, 0, 0));
        }

        const where: Record<string, unknown> = {
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

        const groupedBookings = await prisma.booking.groupBy({
            by: ["bookingDate"],
            _sum: { totalPrice: true },
            _count: { id: true },
            where,
        });

        const bookings: ChartBucketInput[] = groupedBookings.map((b) => ({
            bookingDate: b.bookingDate,
            totalPrice: b._sum.totalPrice || 0,
            count: b._count.id || 0,
        }));

        return this.processChartData(bookings, range);
    }

    async getAllChartData(role: string, userId: string) {
        const { year, month } = getDashboardCalendarBounds();
        const startDate = new Date(Date.UTC(year, month - 11, 1, 0, 0, 0, 0));

        const where: Record<string, unknown> = {
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

        const groupedBookings = await prisma.booking.groupBy({
            by: ["bookingDate"],
            _sum: { totalPrice: true },
            _count: { id: true },
            where,
        });

        const bookings: ChartBucketInput[] = groupedBookings.map((b) => ({
            bookingDate: b.bookingDate,
            totalPrice: b._sum.totalPrice || 0,
            count: b._count.id || 0,
        }));

        return {
            "7d": this.processChartData(bookings, "7d"),
            "30d": this.processChartData(bookings, "30d"),
            "12m": this.processChartData(bookings, "12m"),
        };
    }

    private processChartData(
        bookings: ChartBucketInput[],
        range: ChartRange
    ): ChartPoint[] {
        const { year, month, day } = getDashboardCalendarBounds();
        const bucketMap = new Map<
            string,
            { label: string; total: number; count: number }
        >();

        if (range === "12m") {
            for (let i = 11; i >= 0; i--) {
                const target = new Date(Date.UTC(year, month - i, 1));
                const tYear = target.getUTCFullYear();
                const tMonth = target.getUTCMonth();
                const key = toYearMonthKey(tYear, tMonth);
                const label = `${MONTH_LABELS_ID[tMonth]} ${tYear}`;
                bucketMap.set(key, { label, total: 0, count: 0 });
            }

            bookings.forEach((b) => {
                const d = new Date(b.bookingDate);
                const key = toYearMonthKey(d.getUTCFullYear(), d.getUTCMonth());
                const bucket = bucketMap.get(key);
                if (bucket) {
                    bucket.total += b.totalPrice;
                    bucket.count += b.count;
                }
            });
        } else {
            const days = range === "7d" ? 7 : 30;
            for (let i = days - 1; i >= 0; i--) {
                const target = new Date(Date.UTC(year, month, day - i));
                const key = toUtcDateKey(target);
                const label = `${target.getUTCDate()} ${MONTH_LABELS_ID[target.getUTCMonth()]}`;
                bucketMap.set(key, { label, total: 0, count: 0 });
            }

            bookings.forEach((b) => {
                const key = toUtcDateKey(new Date(b.bookingDate));
                const bucket = bucketMap.get(key);
                if (bucket) {
                    bucket.total += b.totalPrice;
                    bucket.count += b.count;
                }
            });
        }

        return Array.from(bucketMap.values()).map((entry) => ({
            date: entry.label,
            total: entry.total,
            count: entry.count,
        }));
    }
}
