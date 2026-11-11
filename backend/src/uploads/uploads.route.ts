import { Router } from "express";
import { UploadsController } from "./uploads.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from "multer";
import {
    canManageField,
    canManageVenue,
} from "../middleware/permission.middleware";

import { ValidationError } from "../utils/errors";

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 5,
    },
    fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new ValidationError(
                    "Format berkas tidak didukung. Hanya gambar (JPEG, PNG, WebP) yang diizinkan."
                )
            );
        }
    },
});

export class UploadsRoute {
    public path = "/uploads";
    public router = Router();

    constructor(private controller: UploadsController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/venue/:venueId/photos`,
            authMiddleware,
            canManageVenue,
            upload.array("photos", 5),
            this.controller.uploadVenuePhotos
        );

        this.router.post(
            `${this.path}/field/:fieldId/photos`,
            authMiddleware,
            canManageField,
            upload.array("photos", 5),
            this.controller.uploadFieldPhotos
        );

        this.router.post(
            `${this.path}/profile/photo`,
            authMiddleware,
            upload.single("photo"),
            this.controller.uploadProfilePhoto
        );
    }
}
