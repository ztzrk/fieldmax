import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const optionalAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.cookies["sessionId"];
        if (!sessionId) {
            next(); // No session, proceed as guest
            return;
        }

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                user: {
                    include: { profile: true },
                },
            },
        });

        if (!session || session.expiresAt < new Date()) {
            // Invalid session, treat as guest (or optional: clear cookie)
            if (session) {
                await prisma.session.delete({ where: { id: sessionId } });
            }
            // Do NOT return 401, just proceed without user
            next();
            return;
        }

        req.user = session.user;
        next();
    } catch (error) {
        // On error, proceed as guest
        next();
    }
};
