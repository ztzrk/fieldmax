// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export const validationMiddleware = (
    type: any,
    skipMissingProperties = false,
    validateQuery = false
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const source = validateQuery ? req.query : req.body;
        const dto = plainToInstance(type, source);

        const errors = await validate(dto, { skipMissingProperties });

        if (errors.length > 0) {
            const message = errors
                .map((error: ValidationError) =>
                    Object.values(error.constraints || {})
                )
                .join(", ");
            res.status(400).json({ message });
        } else {
            if (validateQuery) {
                (req as any).validatedQuery = dto;
            } else {
                req.body = dto;
            }
            next();
        }
    };
};
