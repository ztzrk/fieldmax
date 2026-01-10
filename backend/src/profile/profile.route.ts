import { Router } from "express";
import { ProfileController } from "./profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
    updateProfileSchema,
    changePasswordSchema,
} from "../schemas/profile.schema";

export class ProfileRoute {
    public path = "/profile";
    public router = Router();

    constructor(private controller: ProfileController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.patch(
            `${this.path}/me`,
            authMiddleware,
            validateRequest(updateProfileSchema),
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
            validateRequest(changePasswordSchema),
            this.controller.changePassword
        );
        this.router.delete(
            `${this.path}/me`,
            authMiddleware,
            this.controller.deleteAccount
        );
    }
}
