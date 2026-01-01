import prisma from "../db";

export class HomeService {
    public async getLandingPageData() {
        const [sportTypes, featuredFields, featuredVenues, stats] =
            await Promise.all([
                prisma.sportType.findMany(),

                prisma.field.findMany({
                    where: { status: "APPROVED", isClosed: false },
                    take: 24,
                    include: {
                        venue: { select: { name: true, city: true } },
                        photos: { take: 1, select: { url: true } },
                        sportType: { select: { name: true } },
                    },
                    orderBy: {},
                }),
                prisma.venue.findMany({
                    where: { status: "APPROVED" },
                    take: 10,
                    include: {
                        _count: { select: { fields: true } },
                    },
                }),

                Promise.all([
                    prisma.venue.count({ where: { status: "APPROVED" } }),
                    prisma.field.count({ where: { status: "APPROVED" } }),
                    prisma.user.count({ where: { role: "USER" } }),
                ]),
            ]);

        return {
            sportTypes,
            featuredFields,
            featuredVenues,
            statistics: {
                venueCount: stats[0],
                fieldCount: stats[1],
                playerCount: stats[2],
            },
        };
    }
}
