// src/profile/profile.route.ts
import { Router } from "express";
import { ProfileController } from "./profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { updateProfileSchema } from "../schemas/profile.schema";

export class ProfileRoute {
    public path = "/profile";
    public router = Router();
    public controller = new ProfileController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.patch(
            `${this.path}/me`,
            authMiddleware,
            validationMiddleware(updateProfileSchema),
            this.controller.updateProfile
        );
        this.router.get(
            `${this.path}/me`,
            authMiddleware,
            this.controller.getProfile
        );
        this.router.patch(
            `${this.path}/change-password`,
            authMiddleware,
            this.controller.changePassword
        );
        this.router.delete(
            `${this.path}/me`,
            authMiddleware,
            this.controller.deleteAccount
        );
    }
}
