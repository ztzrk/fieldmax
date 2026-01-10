import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterUser, LoginUser } from "../schemas/auth.schema";
import { config } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthController {
    constructor(private authService: AuthService) {}

    public register = asyncHandler(async (req: Request, res: Response) => {
        const userData: RegisterUser = req.body;
        const newUser = await this.authService.register(userData);

        res.status(201).json({
            data: newUser,
            message: "User created successfully",
        });
    });

    public login = asyncHandler(async (req: Request, res: Response) => {
        const userData: LoginUser = req.body;
        const { sessionId, user } = await this.authService.login(userData);

        const expiresIn = config.SESSION_EXPIRES_IN_MS / 1000;
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
    });

    public logout = asyncHandler(async (req: Request, res: Response) => {
        const sessionId = req.cookies["sessionId"];
        if (sessionId) {
            await this.authService.logout(sessionId);
        }

        res.setHeader("Set-Cookie", "sessionId=; HttpOnly; Path=/; Max-Age=0");
        res.status(200).json({ message: "Logout successful" });
    });

    public getMe = asyncHandler(async (req: Request, res: Response) => {
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
            profilePictureUrl: userFromMiddleware.profile?.profilePictureUrl,
        };

        res.status(200).json({
            data: responseUser,
            message: "success",
        });
    });

    public verify = asyncHandler(async (req: Request, res: Response) => {
        const { email, code } = req.body;
        await this.authService.verifyEmail(email, code);
        res.status(200).json({ message: "Email verified successfully" });
    });

    public resendCode = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        await this.authService.resendCode(email);
        res.status(200).json({ message: "Verification code sent" });
    });

    public forgotPassword = asyncHandler(
        async (req: Request, res: Response) => {
            const { email } = req.body;
            await this.authService.forgotPassword(email);
            res.status(200).json({ message: "Password reset email sent" });
        }
    );

    public resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const resetData = req.body;
        await this.authService.resetPassword(resetData);
        res.status(200).json({ message: "Password reset successfully" });
    });
}
