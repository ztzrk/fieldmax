import { NextFunction, Request, Response } from "express";
import prisma from "../db";

export const canManageVenue = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const venueId = req.params.id || req.params.venueId;

        if (!user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        if (user.role === "ADMIN") {
            next();
            return;
        }

        if (user.role === "RENTER") {
            if (!venueId) {
                res.status(400).json({ message: "Venue ID is required" });
                return;
            }
            const venue = await prisma.venue.findUnique({
                where: { id: venueId },
                select: { renterId: true },
            });

            if (venue && venue.renterId === user.id) {
                next();
                return;
            }
        }

        res.status(403).json({ message: "Forbidden: You do not have permission to manage this venue" });
    } catch (e) {
        next(e);
    }
};

export const isVenueOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const venueId = req.params.id || req.params.venueId;

        if (!user || user.role !== "RENTER") {
            res.status(403).json({
                message: "Forbidden: Requires Renter role",
            });
            return;
        }

        if (!venueId) {
            res.status(400).json({ message: "Venue ID is required" });
            return;
        }

        const venue = await prisma.venue.findUnique({
            where: { id: venueId },
            select: { renterId: true },
        });

        if (venue && user && venue.renterId === user.id) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden: You do not own this venue" });
        }
    } catch (error) {
        next(error);
    }
};

export const canCreateFieldInVenue = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const venueId = req.body.venueId;

        if (!user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        if (user.role === "ADMIN") {
            next();
            return;
        }

        if (user.role === "RENTER") {
            if (!venueId) {
                res.status(400).json({ message: "Venue ID is required" });
                return;
            }

            const venue = await prisma.venue.findUnique({
                where: { id: venueId },
                select: { renterId: true },
            });

            if (venue && venue.renterId === user.id) {
                next();
                return;
            }
        }

        res.status(403).json({ message: "Forbidden: You do not own the target venue" });
    } catch (error) {
        next(error);
    }
};

export const canManageField = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const fieldId = req.params.id || req.params.fieldId;

        if (!user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        if (user.role === "ADMIN") {
            next();
            return;
        }

        if (user.role === "RENTER") {
            if (!fieldId) {
                res.status(400).json({ message: "Field ID is required" });
                return;
            }
            const field = await prisma.field.findUnique({
                where: { id: fieldId },
                select: { venue: { select: { renterId: true } } },
            });

            if (field && field.venue.renterId === user.id) {
                next();
                return;
            }
            res.status(403).json({ message: "Forbidden: You do not own this field" });
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (error) {
        next(error);
    }
};

export const canManageVenuePhoto = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const photoId = req.params.photoId;

        if (!user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        if (user.role === "ADMIN") {
            next();
            return;
        }

        if (user.role === "RENTER") {
            if (!photoId) {
                res.status(400).json({ message: "Photo ID is required" });
                return;
            }

            const photo = await prisma.venuePhoto.findUnique({
                where: { id: photoId },
                select: { venue: { select: { renterId: true } } },
            });

            if (photo && photo.venue.renterId === user.id) {
                next();
                return;
            }
        }

        res.status(403).json({ message: "Forbidden: You do not own this photo" });
    } catch (error) {
        next(error);
    }
};

export const canManageFieldPhoto = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const photoId = req.params.photoId;

        if (!user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }

        if (user.role === "ADMIN") {
            next();
            return;
        }

        if (user.role === "RENTER") {
            if (!photoId) {
                res.status(400).json({ message: "Photo ID is required" });
                return;
            }

            const photo = await prisma.fieldPhoto.findUnique({
                where: { id: photoId },
                select: { field: { select: { venue: { select: { renterId: true } } } } },
            });

            if (photo && photo.field.venue.renterId === user.id) {
                next();
                return;
            }
        }

        res.status(403).json({ message: "Forbidden: You do not own this photo" });
    } catch (error) {
        next(error);
    }
};

export const renterOnlyMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = req.user;
    if (user && user.role === "RENTER") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Requires Renter role" });
    }
};
