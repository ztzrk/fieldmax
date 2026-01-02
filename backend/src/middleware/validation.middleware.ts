// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/errors";

export const validationMiddleware = (
    schema: ZodSchema,
    validateQuery = false
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const source = validateQuery ? req.query : req.body;
            const validatedData = await schema.parseAsync(source);

            if (validateQuery) {
                // @ts-ignore: validatedQuery might not be defined in Request type yet
                req.validatedQuery = validatedData;
            } else {
                req.body = validatedData;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.errors.map((err) => {
                    return {
                        field: err.path.join("."),
                        message: err.message,
                    };
                });
                next(new ValidationError("Validation failed", details));
            } else {
                next(error);
            }
        }
    };
};
