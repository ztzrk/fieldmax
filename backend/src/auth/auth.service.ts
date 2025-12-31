import { User } from "@prisma/client";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { randomBytes } from "crypto";
import prisma from "../db";
import {
    ConflictError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from "../utils/errors";
import { sendVerificationEmail } from "../lib/mailer";
import bcrypt from "bcryptjs";

export class AuthService {
    public async register(
        userData: RegisterUserDto
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
                verificationCode,
                verificationCodeExpiresAt,
            },
        });

        await sendVerificationEmail(createdUser.email, verificationCode);

        const { password, ...userWithoutPassword } = createdUser;
        return userWithoutPassword;
    }

    public async login(
        userData: LoginUserDto
    ): Promise<{ sessionId: string; user: Omit<User, "password"> }> {
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
            throw new UnauthorizedError("Password not matching");
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

        if (
            !user.verificationCode ||
            user.verificationCode !== code ||
            !user.verificationCodeExpiresAt ||
            user.verificationCodeExpiresAt < new Date()
        ) {
            throw new ValidationError("Invalid or expired verification code.");
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationCode: null,
                verificationCodeExpiresAt: null,
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

        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationCode,
                verificationCodeExpiresAt,
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
}
