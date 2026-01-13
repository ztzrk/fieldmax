import { PrismaClient } from "@prisma/client";

const sportTypes = [
    { name: "Futsal" },
    { name: "Basketball" },
    { name: "Football" },
    { name: "Badminton" },
    { name: "Tennis" },
    { name: "Volleyball" },
    { name: "Table Tennis" },
    { name: "Swimming" },
    { name: "Gym" },
    { name: "Yoga" },
    { name: "Cricket" },
    { name: "Rugby" },
    { name: "Hockey" },
    { name: "Golf" },
    { name: "Baseball" },
    { name: "Softball" },
    { name: "Squash" },
    { name: "Boxing" },
    { name: "MMA" },
    { name: "Cycling" },
];

export async function seedSportTypes(prisma: PrismaClient) {
    console.log(`Start seeding ${sportTypes.length} sport types...`);

    for (const sport of sportTypes) {
        const existing = await prisma.sportType.findUnique({
            where: { name: sport.name },
        });

        if (!existing) {
            await prisma.sportType.create({
                data: sport,
            });
            console.log(`Created sport type: ${sport.name}`);
        } else {
            console.log(`Sport type already exists: ${sport.name}`);
        }
    }

    console.log("Seeding sport types finished.");
}
