import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { sendError } from "../utils/response";

export const validateRequest =
    (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (parsed.body) {
                req.body = parsed.body;
            }
            if (parsed.query) {
                try {
                    req.query = parsed.query;
                } catch {
                    // If req.query is read-only, we must clear and assign properties
                    // But some frameworks make the object itself immutable.
                    // Let's try defining the property on the req object itself.
                    Object.defineProperty(req, "query", {
                        value: parsed.query,
                        writable: true,
                        configurable: true,
                    });
                }
            }
            if (parsed.params) {
                try {
                    req.params = parsed.params;
                } catch {
                    Object.defineProperty(req, "params", {
                        value: parsed.params,
                        writable: true,
                        configurable: true,
                    });
                }
            }

            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                }));

                return sendError(
                    res,
                    "Validation Error",
                    "VALIDATION_ERROR",
                    400,
                    formattedErrors
                );
            }
            return next(error);
        }
    };
