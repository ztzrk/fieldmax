import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function seedUsers(prisma: PrismaClient) {
    console.log("Seeding users...");

    const hashedPassword = await bcrypt.hash("password", 10);

    // Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: { isVerified: true },
        create: {
            email: "admin@example.com",
            fullName: "Admin User",
            password: hashedPassword,
            role: "ADMIN" as UserRole,
            isVerified: true,
        },
    });
    console.log({ admin });

    // Create Renter
    const renter = await prisma.user.upsert({
        where: { email: "renter@example.com" },
        update: { isVerified: true },
        create: {
            email: "renter@example.com",
            fullName: "Renter User",
            password: hashedPassword,
            role: "RENTER" as UserRole,
            isVerified: true,
        },
    });
    console.log({ renter });

    // Create User
    const user = await prisma.user.upsert({
        where: { email: "user@example.com" },
        update: { isVerified: true },
        create: {
            email: "user@example.com",
            fullName: "Normal User",
            password: hashedPassword,
            role: "USER" as UserRole,
            isVerified: true,
        },
    });
    console.log({ user });

    console.log("Seeding users finished.");
}
