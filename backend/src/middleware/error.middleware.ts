import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/errors";
import { logger } from "../utils/logger";

export const errorMiddleware = (
    err: CustomError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const status: number =
            err instanceof CustomError ? err.statusCode : 500;
        const message: string = err.message || "Something went wrong";
        const code: string =
            err instanceof CustomError ? err.code : "INTERNAL_SERVER_ERROR";
        const details: any = err instanceof CustomError ? err.details : null;

        if (status === 500) {
            console.error(`[ERROR 500]`, message, err.stack);
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
