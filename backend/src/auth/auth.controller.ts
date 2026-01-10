// src/auth/auth.controller.ts
import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
    RegisterUser,
    LoginUser,
    ForgotPassword,
    ResetPassword,
} from "../schemas/auth.schema";

export class AuthController {
    constructor(private authService: AuthService) {}

    public register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userData: RegisterUser = req.body;
            const newUser = await this.authService.register(userData);

            res.status(201).json({
                data: newUser,
                message: "User created successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    public login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userData: LoginUser = req.body;
            const { sessionId, user } = await this.authService.login(userData);

            const expiresIn = 24 * 60 * 60;
            res.setHeader("Set-Cookie", [
                `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=${expiresIn}; SameSite=Lax`,
            ]);

            const responseUser = {
                ...user,
                profilePictureUrl: user.profile?.profilePictureUrl,
            };

            res.status(200).json({
                data: { user: responseUser },
                message: "Login successful",
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "Invalid credentials, please try again."
            ) {
                res.status(401).json({ message: error.message });
            } else {
                next(error);
            }
        }
    };

    public logout = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const sessionId = req.cookies["sessionId"];
            if (sessionId) {
                await this.authService.logout(sessionId);
            }

            res.setHeader(
                "Set-Cookie",
                "sessionId=; HttpOnly; Path=/; Max-Age=0"
            );
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            next(error);
        }
    };

    public getMe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userFromMiddleware = req.user;

            if (!userFromMiddleware) {
                res.status(401).json({
                    message: "Not authenticated or user not found",
                });
                return;
            }

            const { password, ...userWithoutPassword } = userFromMiddleware;

            const responseUser = {
                ...userWithoutPassword,
                profilePictureUrl:
                    userFromMiddleware.profile?.profilePictureUrl,
            };

            res.status(200).json({
                data: responseUser,
                message: "success",
            });
        } catch (error) {
            next(error);
        }
    };

    public verify = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email, code } = req.body;
            await this.authService.verifyEmail(email, code);
            res.status(200).json({ message: "Email verified successfully" });
        } catch (error) {
            next(error);
        }
    };

    public resendCode = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email } = req.body;
            await this.authService.resendCode(email);
            res.status(200).json({ message: "Verification code sent" });
        } catch (error) {
            next(error);
        }
    };

    public forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email } = req.body;
            await this.authService.forgotPassword(email);
            res.status(200).json({ message: "Password reset email sent" });
        } catch (error) {
            next(error);
        }
    };

    public resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const resetData = req.body;
            await this.authService.resetPassword(resetData);
            res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            next(error);
        }
    };
}
