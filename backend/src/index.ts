// src/index.ts
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import { AuthRoute } from "./auth/auth.route";
import { UsersRoute } from "./users/users.route";

import cors from "cors";
import cookieParser from "cookie-parser";
import { SportTypesRoute } from "./sport-types/sport-types.route";
import { VenuesRoute } from "./venues/venues.route";
import { FieldsRoute } from "./fields/fields.route";
import { UploadsRoute } from "./uploads/uploads.route";
import { RenterRoute } from "./renter/renter.route";
import { ChatRoute } from "./chat/chat.route";
import { ProfileRoute } from "./profile/profile.route";
import { BookingsRoute } from "./bookings/bookings.route";
import { PaymentsRoute } from "./payments/payments.route";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CustomError } from "./utils/errors";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoute = new AuthRoute();
const usersRoute = new UsersRoute();
const sportTypesRoute = new SportTypesRoute();
const venuesRoute = new VenuesRoute();
const fieldsRoute = new FieldsRoute();
const uploadsRoute = new UploadsRoute();
const renterRoute = new RenterRoute();
const chatRoute = new ChatRoute();
const profileRoute = new ProfileRoute();
const bookingsRoute = new BookingsRoute();
const paymentsRoute = new PaymentsRoute();

app.use("/api", authRoute.router);
app.use("/api", usersRoute.router);
app.use("/api", sportTypesRoute.router);
app.use("/api", venuesRoute.router);
app.use("/api", uploadsRoute.router);
app.use("/api", fieldsRoute.router);
app.use("/api", renterRoute.router);
app.use("/api", chatRoute.router);
app.use("/api", profileRoute.router);
app.use("/api", bookingsRoute.router);
app.use("/api", paymentsRoute.router);

// Simple test route
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to FIELDMAX API! 🚀");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error for debugging

    let statusCode = 500;
    let message = "Something went wrong!";

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 409; // Conflict
            const target = Array.isArray(err.meta?.target)
                ? err.meta?.target.join(", ")
                : err.meta?.target || "field";
            message = `The ${target} already exists.`;
        } else {
            statusCode = 400; // Bad Request for other known Prisma client errors
            message = err.message;
        }
    } else if (err.message) {
        statusCode = 400; // Assume bad request if a specific error message is provided
        message = err.message;
    }

    res.status(statusCode).json({ message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
