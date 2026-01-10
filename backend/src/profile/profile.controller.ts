import { Request, Response } from "express";
import { ProfileService } from "./profile.service";
import { UpdateProfile } from "../schemas/profile.schema";
import { asyncHandler } from "../utils/asyncHandler";

export class ProfileController {
    constructor(private service: ProfileService) {}

    public updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const profileData: UpdateProfile = req.body;
        const data = await this.service.updateProfile(userId, profileData);
        res.status(200).json({ data, message: "Profile updated" });
    });

    public getProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const data = await this.service.getProfile(userId);
        res.status(200).json({ data, message: "Profile fetched" });
    });

    public changePassword = asyncHandler(
        async (req: Request, res: Response) => {
            const userId = req.user!.id;
            const { newPassword } = req.body;
            await this.service.changePassword(userId, newPassword);
            res.status(200).json({ message: "Password changed" });
        }
    );

    public deleteAccount = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        await this.service.deleteAccount(userId);
        res.status(200).json({ message: "Account deleted" });
    });
}
