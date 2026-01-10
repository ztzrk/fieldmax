import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger";
import { config } from "../config/env";

// Middleware to bypass rate limiting in development
const limiterOrNext = (limiter: any) => {
    return config.NODE_ENV === "production"
        ? limiter
        : (req: any, res: any, next: any) => next();
};

export const globalLimiter = limiterOrNext(
    rateLimit({
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        max: config.RATE_LIMIT_MAX_REQUESTS,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: {
            status: 429,
            message:
                "Too many requests from this IP, please try again after 15 minutes",
        },
        handler: (req, res, next, options) => {
            logger.warn(
                `Rate limit exceeded for IP: ${req.ip} on route: ${req.originalUrl}`
            );
            res.status(options.statusCode).send(options.message);
        },
    })
);

export const authLimiter = limiterOrNext(
    rateLimit({
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        max: config.AUTH_RATE_LIMIT_MAX_REQUESTS,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 429,
            message:
                "Too many login attempts from this IP, please try again after 15 minutes",
        },
        handler: (req, res, next, options) => {
            logger.warn(
                `Auth rate limit exceeded for IP: ${req.ip} on route: ${req.originalUrl}`
            );
            res.status(options.statusCode).send(options.message);
        },
    })
);
