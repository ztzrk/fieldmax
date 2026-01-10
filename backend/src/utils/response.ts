import { Response } from "express";
import { ApiResponse } from "@fieldmax/shared";

export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200,
    meta?: ApiResponse["meta"]
) => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
        meta,
    };
    res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    code: string = "INTERNAL_SERVER_ERROR",
    statusCode: number = 500,
    details?: any
) => {
    const response: ApiResponse = {
        success: false,
        error: {
            code,
            message,
            details,
        },
    };
    res.status(statusCode).json(response);
};
