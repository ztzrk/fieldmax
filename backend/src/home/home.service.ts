import prisma from "../db";

export class HomeService {
    public async getLandingPageData() {
        // 1. Get stats for Top Venues (by booking count)
        const [fieldBookings, fields] = await Promise.all([
            prisma.booking.groupBy({
                by: ["fieldId"],
                _count: { id: true },
            }),
            prisma.field.findMany({ select: { id: true, venueId: true } }),
        ]);

        const venueBookingCounts: Record<string, number> = {};
        fieldBookings.forEach((fb) => {
            const field = fields.find((f) => f.id === fb.fieldId);
            if (field && field.venueId) {
                venueBookingCounts[field.venueId] =
                    (venueBookingCounts[field.venueId] || 0) + fb._count.id;
            }
        });

        const sortedVenueIds = Object.keys(venueBookingCounts).sort(
            (a, b) => venueBookingCounts[b] - venueBookingCounts[a]
        );
        const topVenueIds = sortedVenueIds.slice(0, 10);

        // 2. Get stats for Top Fields (by rating)
        const reviewStats = await prisma.review.groupBy({
            by: ["fieldId"],
            _avg: { rating: true },
            _count: { rating: true },
        });

        const sortedReviewStats = reviewStats
            .filter((r) => (r._avg.rating || 0) > 0)
            .sort((a, b) => (b._avg.rating || 0) - (a._avg.rating || 0));

        const topFieldIds = sortedReviewStats
            .slice(0, 10)
            .map((r) => r.fieldId);

        // 3. Fetch Data
        const [sportTypes, featuredFields, featuredVenues, stats] =
            await Promise.all([
                prisma.sportType.findMany(),

                // Top Rated Fields
                prisma.field.findMany({
                    where: {
                        id: { in: topFieldIds },
                        status: "APPROVED",
                        isClosed: false,
                    },
                    include: {
                        venue: { select: { name: true, city: true } },
                        photos: { take: 1, select: { url: true } },
                        sportType: { select: { name: true } },
                    },
                }),

                // Most Booked Venues
                prisma.venue.findMany({
                    where: { id: { in: topVenueIds }, status: "APPROVED" },
                    include: {
                        renter: {
                            select: {
                                fullName: true,
                                email: true,
                            },
                        },
                        photos: true,
                        _count: { select: { fields: true } },
                    },
                }),

                Promise.all([
                    prisma.venue.count({ where: { status: "APPROVED" } }),
                    prisma.field.count({ where: { status: "APPROVED" } }),
                    prisma.user.count({ where: { role: "USER" } }),
                ]),
            ]);

        // 4. Map Data
        const featuredFieldsWithRating = featuredFields
            .map((field) => {
                const stat = reviewStats.find((r) => r.fieldId === field.id);
                return {
                    ...field,
                    rating: stat?._avg.rating || 0,
                    reviewCount: stat?._count.rating || 0,
                };
            })
            .sort((a, b) => b.rating - a.rating); // Ensure sorted order matches

        const featuredVenuesWithCount = featuredVenues
            .map((venue) => ({
                ...venue,
                bookingCount: venueBookingCounts[venue.id] || 0,
            }))
            .sort((a, b) => b.bookingCount - a.bookingCount);

        return {
            sportTypes,
            featuredFields: featuredFieldsWithRating,
            featuredVenues: featuredVenuesWithCount,
            statistics: {
                venueCount: stats[0],
                fieldCount: stats[1],
                playerCount: stats[2],
            },
        };
    }
}
