import { Request, Response, NextFunction } from "express";

import { VenuesService } from "../venues/venues.service";
import { FieldsService } from "../fields/fields.service";
import { ProfileService } from "../profile/profile.service";

export class UploadsController {
    constructor(
        private venuesService: VenuesService,
        private fieldsService: FieldsService,
        private profileService: ProfileService
    ) {}

    public uploadVenuePhotos = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { venueId } = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                throw new Error("No files uploaded.");
            }

            const savedPhotos = await this.venuesService.addPhotos(
                venueId,
                files,
                req.user!
            );

            res.status(201).json({
                data: savedPhotos,
                message: "Photos uploaded successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    public uploadFieldPhotos = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { fieldId } = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                throw new Error("No files uploaded.");
            }

            const savedPhotos = await this.fieldsService.addPhotos(
                fieldId,
                files,
                req.user!
            );

            res.status(201).json({
                data: savedPhotos,
                message: "Photos uploaded successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    public uploadProfilePhoto = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user!.id;
            const file = req.file;

            if (!file) {
                throw new Error("No file uploaded.");
            }

            const imagekit = require("../lib/imagekit").default;

            const cleanOriginalName = file.originalname
                .trim()
                .replace(/\s+/g, "-");
            const fileName = `profile-${userId}-${Date.now()}-${cleanOriginalName}`;

            const uploadResult = await imagekit.upload({
                file: file.buffer,
                fileName: fileName,
                folder: "user-profiles",
            });

            const updatedProfile = this.profileService.updateProfile(userId, {
                profilePictureUrl: uploadResult.url,
            });

            res.status(200).json({
                data: updatedProfile,
                message: "Profile photo updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
