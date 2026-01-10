import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
    RegisterInput as RegisterUser,
    LoginInput as LoginUser,
} from "@fieldmax/shared";
import { config } from "../config/env";
import { asyncHandler } from "../utils/asyncHandler";

// ... imports
import { sendSuccess } from "../utils/response";

export class AuthController {
    constructor(private authService: AuthService) {}

    public register = asyncHandler(async (req: Request, res: Response) => {
        const userData: RegisterUser = req.body;
        const newUser = await this.authService.register(userData);

        sendSuccess(res, newUser, "User created successfully", 201);
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

        sendSuccess(res, { user: responseUser }, "Login successful");
    });

    public logout = asyncHandler(async (req: Request, res: Response) => {
        const sessionId = req.cookies["sessionId"];
        if (sessionId) {
            await this.authService.logout(sessionId);
        }

        res.setHeader("Set-Cookie", "sessionId=; HttpOnly; Path=/; Max-Age=0");
        sendSuccess(res, null, "Logout successful");
    });

    public getMe = asyncHandler(async (req: Request, res: Response) => {
        const userFromMiddleware = req.user;

        if (!userFromMiddleware) {
            res.status(401).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Not authenticated or user not found",
                },
            });
            return;
        }

        const { password, ...userWithoutPassword } = userFromMiddleware;

        const responseUser = {
            ...userWithoutPassword,
            profilePictureUrl: userFromMiddleware.profile?.profilePictureUrl,
        };

        sendSuccess(res, responseUser, "success");
    });

    public verify = asyncHandler(async (req: Request, res: Response) => {
        const { email, code } = req.body;
        await this.authService.verifyEmail(email, code);
        sendSuccess(res, null, "Email verified successfully");
    });

    public resendCode = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        await this.authService.resendCode(email);
        sendSuccess(res, null, "Verification code sent");
    });

    public forgotPassword = asyncHandler(
        async (req: Request, res: Response) => {
            const { email } = req.body;
            await this.authService.forgotPassword(email);
            sendSuccess(res, null, "Password reset email sent");
        }
    );

    public resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const resetData = req.body;
        await this.authService.resetPassword(resetData);
        sendSuccess(res, null, "Password reset successfully");
    });
}
