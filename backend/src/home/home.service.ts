import { PrismaClient } from "@prisma/client";
import prisma from "../db";

export class HomeService {
    public async getLandingPageData() {
        const [sportTypes, featuredFields, featuredVenues, stats] =
            await Promise.all([
                // 1. Sport Types
                prisma.sportType.findMany(),

                // 2. Featured Fields (Limit 24, Approved, Not Closed)
                prisma.field.findMany({
                    where: { status: "APPROVED", isClosed: false },
                    take: 24,
                    include: {
                        venue: { select: { name: true, city: true } },
                        photos: { take: 1, select: { url: true } },
                        sportType: { select: { name: true } },
                    },
                    orderBy: {
                        // Random-ish or specific logic could go here.
                        // For now, newest first or by some score if available.
                        // We don't have a 'featured' flag, so using ID or creation date.
                        // Using default implicit order (often ID) is fine for now.
                    },
                }),

                // 3. Featured Venues (Limit 10, Approved)
                prisma.venue.findMany({
                    where: { status: "APPROVED" },
                    take: 10,
                    include: {
                        _count: { select: { fields: true } },
                    },
                }),

                // 4. Statistics
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
