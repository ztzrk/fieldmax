// src/index.ts
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import express, { Express, Request, Response } from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { globalLimiter } from "./middleware/rateLimit.middleware";
import { logger } from "./utils/logger";
import cookieParser from "cookie-parser";
import { AuthRoute } from "./auth/auth.route";
import { BookingsRoute } from "./bookings/bookings.route";
import { FieldsRoute } from "./fields/fields.route";
import { PaymentsRoute } from "./payments/payments.route";
import { ProfileRoute } from "./profile/profile.route";
import { RenterRoute } from "./renter/renter.route";
import { SportTypesRoute } from "./sport-types/sport-types.route";
import { UploadsRoute } from "./uploads/uploads.route";
import { UsersRoute } from "./users/users.route";
import { VenuesRoute } from "./venues/venues.route";
import { DashboardRoute } from "./dashboard/dashboard.route";
import { CronService } from "./services/cron.service";

import { ReviewsRoute } from "./reviews/reviews.route";
import { ReportsRoute } from "./reports/reports.route";
import { HomeRoute } from "./home/home.route";

CronService.init();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(globalLimiter);
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

const homeRoute = new HomeRoute();
const usersRoute = new UsersRoute();
const sportTypesRoute = new SportTypesRoute();
const venuesRoute = new VenuesRoute();
const fieldsRoute = new FieldsRoute();
const uploadsRoute = new UploadsRoute();
const renterRoute = new RenterRoute();

const profileRoute = new ProfileRoute();
const bookingsRoute = new BookingsRoute();
const paymentsRoute = new PaymentsRoute();
const dashboardRoute = new DashboardRoute();
const reviewsRoute = new ReviewsRoute();
const reportsRoute = new ReportsRoute();

app.use("/api", authRoute.router);
app.use("/api", usersRoute.router);
app.use("/api", sportTypesRoute.router);
app.use("/api", venuesRoute.router);
app.use("/api", uploadsRoute.router);
app.use("/api", fieldsRoute.router);
app.use("/api", renterRoute.router);

app.use("/api", profileRoute.router);
app.use("/api", bookingsRoute.router);
app.use("/api", paymentsRoute.router);
app.use("/api", dashboardRoute.router);
app.use("/api", reviewsRoute.router);
app.use("/api", reportsRoute.router);
app.use("/api", homeRoute.router);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to FIELDMAX API! 🚀");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    logger.info(`[server]: Server is running at http://localhost:${PORT}`);
});
