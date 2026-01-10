import { Request, Response } from "express";
import { ProfileService } from "./profile.service";
import { UpdateProfile } from "../schemas/profile.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class ProfileController {
    constructor(private service: ProfileService) {}

    public updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const profileData: UpdateProfile = req.body;
        const data = await this.service.updateProfile(userId, profileData);
        sendSuccess(res, data, "Profile updated");
    });

    public getProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const data = await this.service.getProfile(userId);
        sendSuccess(res, data, "Profile fetched");
    });

    public changePassword = asyncHandler(
        async (req: Request, res: Response) => {
            const userId = req.user!.id;
            const { newPassword } = req.body;
            await this.service.changePassword(userId, newPassword);
            sendSuccess(res, null, "Password changed");
        }
    );

    public deleteAccount = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        await this.service.deleteAccount(userId);
        sendSuccess(res, null, "Account deleted");
    });
}
