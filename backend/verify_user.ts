import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "testuser6@example.com";
    console.log(`Verifying user ${email}...`);
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { isVerified: true },
        });
        console.log("User verified:", user.id);
    } catch (error) {
        console.error("Error verifying user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
