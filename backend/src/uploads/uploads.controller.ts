import { Request, Response } from "express";

import { VenuesService } from "../venues/venues.service";
import { FieldsService } from "../fields/fields.service";
import { ProfileService } from "../profile/profile.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";

export class UploadsController {
    constructor(
        private venuesService: VenuesService,
        private fieldsService: FieldsService,
        private profileService: ProfileService
    ) {}

    public uploadVenuePhotos = asyncHandler(
        async (req: Request, res: Response) => {
            const { venueId } = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                return sendError(res, "No files uploaded.", "BAD_REQUEST", 400);
            }

            const savedPhotos = await this.venuesService.addPhotos(
                venueId,
                files,
                req.user!
            );
            sendSuccess(res, savedPhotos, "Photos uploaded successfully", 201);
        }
    );

    public uploadFieldPhotos = asyncHandler(
        async (req: Request, res: Response) => {
            const { fieldId } = req.params;
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                return sendError(res, "No files uploaded.", "BAD_REQUEST", 400);
            }

            const savedPhotos = await this.fieldsService.addPhotos(
                fieldId,
                files,
                req.user!
            );
            sendSuccess(res, savedPhotos, "Photos uploaded successfully", 201);
        }
    );

    public uploadProfilePhoto = asyncHandler(
        async (req: Request, res: Response) => {
            const userId = req.user!.id;
            const file = req.file;

            if (!file) {
                return sendError(res, "No file uploaded.", "BAD_REQUEST", 400);
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

            const updatedProfile = await this.profileService.updateProfile(
                userId,
                {
                    profilePictureUrl: uploadResult.url,
                }
            );

            sendSuccess(
                res,
                updatedProfile,
                "Profile photo updated successfully"
            );
        }
    );
}
