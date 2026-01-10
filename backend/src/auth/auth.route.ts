// src/auth/auth.route.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import {
    registerSchema as registerUserSchema,
    loginSchema as loginUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from "@fieldmax/shared";
import { authMiddleware } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimit.middleware";

export class AuthRoute {
    public path = "/auth";
    public router = Router();

    constructor(private authController: AuthController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/register`,
            authLimiter,
            validationMiddleware(registerUserSchema),
            this.authController.register
        );

        this.router.post(
            `${this.path}/login`,
            authLimiter,
            validationMiddleware(loginUserSchema),
            this.authController.login
        );
        this.router.post(`${this.path}/logout`, this.authController.logout);
        this.router.get(
            `${this.path}/me`,
            authMiddleware,
            this.authController.getMe
        );

        this.router.post(
            `${this.path}/verify`,
            authLimiter,
            this.authController.verify
        );

        this.router.post(
            `${this.path}/resend-code`,
            authLimiter,
            this.authController.resendCode
        );

        this.router.post(
            `${this.path}/forgot-password`,
            authLimiter,
            validationMiddleware(forgotPasswordSchema),
            this.authController.forgotPassword
        );

        this.router.post(
            `${this.path}/reset-password`,
            authLimiter,
            validationMiddleware(resetPasswordSchema),
            this.authController.resetPassword
        );
    }
}
