// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { plainToInstance } from "class-transformer";
import {
    validate,
    ValidationError as ClassValidatorError,
} from "class-validator";
import { ValidationError } from "../utils/errors";

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
            const details = errors.map((error: ClassValidatorError) => {
                const constraints = error.constraints || {};
                const firstConstraint =
                    Object.values(constraints)[0] || "Invalid value";
                return {
                    field: error.property,
                    message: firstConstraint,
                };
            });

            next(new ValidationError("Validation failed", details));
        } else {
            if (validateQuery) {
                req.validatedQuery = dto;
            } else {
                req.body = dto;
            }
            next();
        }
    };
};
