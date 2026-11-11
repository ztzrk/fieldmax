import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/errors";
import { logger } from "../utils/logger";
import multer from "multer";

export const errorMiddleware = (
    err: CustomError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let status: number =
            err instanceof CustomError ? err.statusCode : 500;
        let message: string = err.message || "Something went wrong";
        let code: string =
            err instanceof CustomError ? err.code : "INTERNAL_SERVER_ERROR";
        let details: any = err instanceof CustomError ? err.details : null;

        if (err instanceof multer.MulterError) {
            status = 400;
            code = "VALIDATION_ERROR";
            if (err.code === "LIMIT_FILE_SIZE") {
                message = "Ukuran berkas terlalu besar. Maksimal 5 MB per gambar.";
            } else if (err.code === "LIMIT_FILE_COUNT") {
                message = "Jumlah berkas melebihi batas maksimal (maksimal 5 foto).";
            } else {
                message = `Kesalahan unggah berkas: ${err.message}`;
            }
        }

        if (status === 500) {
            logger.error(
                `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}, Stack:: ${err.stack}`
            );
        } else {
            logger.warn(
                `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
            );
        }

        const response: import("@fieldmax/shared").ApiResponse = {
            success: false,
            error: {
                code,
                message,
                details,
            },
        };

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};
