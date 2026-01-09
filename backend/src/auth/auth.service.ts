import { User, UserProfile } from "@prisma/client";
import { RegisterUser, LoginUser } from "../schemas/auth.schema";
import { randomBytes } from "crypto";
import prisma from "../db";
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from "../utils/errors";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/mailer";
import bcrypt from "bcryptjs";

export class AuthService {
    public async register(
        userData: RegisterUser
    ): Promise<Omit<User, "password">> {
        if (userData.role === "ADMIN") {
            throw new ForbiddenError(
                "Admin role cannot be registered through this public endpoint."
            );
        }

        const findUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (findUser) {
            throw new ConflictError(
                `This email ${userData.email} already exists.`
            );
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const { confirmPassword, ...restUserData } = userData;

        const createdUser = await prisma.user.create({
            data: {
                ...restUserData,
                password: hashedPassword,
                isVerified: false,
            },
        });

        await prisma.verificationToken.create({
            data: {
                identifier: createdUser.email,
                token: verificationCode,
                expires: verificationCodeExpiresAt,
            },
        });

        await sendVerificationEmail(createdUser.email, verificationCode);

        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
    }

    public async login(userData: LoginUser): Promise<{
        sessionId: string;
        user: Omit<User, "password"> & { profile: UserProfile | null };
    }> {
        const findUser = await prisma.user.findUnique({
            where: { email: userData.email },
            include: { profile: true },
        });
        if (!findUser) {
            throw new NotFoundError(
                `This email ${userData.email} was not found.`
            );
        }

        const isPasswordMatching = await bcrypt.compare(
            userData.password,
            findUser.password
        );
        if (!isPasswordMatching) {
            throw new UnauthorizedError(
                "Invalid credentials, please try again."
            );
        }

        if (!findUser.isVerified) {
            throw new ForbiddenError(
                "Email not verified. Please verify your email."
            );
        }

        const sessionId = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await prisma.session.create({
            data: {
                id: sessionId,
                userId: findUser.id,
                expiresAt: expiresAt,
            },
        });

        const { password, ...userWithoutPassword } = findUser;
        return { sessionId, user: userWithoutPassword };
    }

    public async verifyEmail(email: string, code: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundError("User not found.");

        if (user.isVerified) return;

        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: code,
            },
        });

        if (!verificationToken || verificationToken.expires < new Date()) {
            throw new ValidationError("Invalid or expired verification code.");
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true },
        });

        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: code,
                },
            },
        });
    }

    public async resendCode(email: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundError("User not found.");
        if (user.isVerified) throw new ConflictError("Email already verified.");

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        const verificationCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Delete existing tokens for this user to avoid duplicates if any (though identifier is part of composite unique)
        await prisma.verificationToken.deleteMany({
            where: { identifier: email },
        });

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: verificationCode,
                expires: verificationCodeExpiresAt,
            },
        });

        await sendVerificationEmail(email, verificationCode);
    }

    public async logout(sessionId: string): Promise<void> {
        await prisma.session
            .delete({
                where: { id: sessionId },
            })
            .catch(() => {});
    }

    public async forgotPassword(email: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new NotFoundError("User not found.");

        const resetToken = randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Invalidate old tokens
        await prisma.resetToken.deleteMany({
            where: { userId: user.id },
        });

        await prisma.resetToken.create({
            data: {
                token: resetToken,
                expires: resetTokenExpiry,
                userId: user.id,
            },
        });

        await sendPasswordResetEmail(email, resetToken);
    }

    public async resetPassword(
        resetData: import("../schemas/auth.schema").ResetPassword
    ): Promise<void> {
        const { token, password, confirmPassword } = resetData;

        if (password !== confirmPassword) {
            throw new ValidationError("Passwords do not match.");
        }

        const existingToken = await prisma.resetToken.findUnique({
            where: { token },
        });

        if (!existingToken || existingToken.expires < new Date()) {
            throw new ValidationError("Invalid or expired reset token.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: existingToken.userId },
            data: {
                password: hashedPassword,
            },
        });

        await prisma.resetToken.delete({
            where: { id: existingToken.id },
        });
    }
}
