import prisma from "../db";
import { UpdateProfile, ChangePassword } from "../schemas/profile.schema";
import bcrypt from "bcryptjs";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

export class ProfileService {
    public async updateProfile(userId: string, data: UpdateProfile) {
        const { fullName, phoneNumber, ...profileData } = data;

        return prisma.$transaction(async (tx) => {
            if (fullName || phoneNumber) {
                await tx.user.update({
                    where: { id: userId },
                    data: { fullName, phoneNumber },
                });
            }

            const updatedProfile = await tx.userProfile.upsert({
                where: { userId },
                update: profileData,
                create: {
                    userId,
                    ...profileData,
                },
            });

            return updatedProfile;
        });
    }

    public async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
            },
        });

        if (!user) return null;

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    public async changePassword(userId: string, data: ChangePassword) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundError("User not found.");
        }

        const isMatch = await bcrypt.compare(data.oldPassword, user.password);
        if (!isMatch) {
            throw new UnauthorizedError("Current password is incorrect.");
        }

        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        return prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }

    public async deleteAccount(userId: string) {
        return prisma.user.delete({
            where: { id: userId },
        });
    }
}
