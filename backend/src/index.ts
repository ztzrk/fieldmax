// src/index.ts
import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import express, { Express, Request, Response } from "express";
import { errorMiddleware } from "./middleware/error.middleware";
import { globalLimiter } from "./middleware/rateLimit.middleware";
import { logger } from "./utils/logger";
import cookieParser from "cookie-parser";
// Services
import { AuthService } from "./auth/auth.service";
import { BookingsService } from "./bookings/bookings.service";
import { FieldsService } from "./fields/fields.service";
import { PaymentsService } from "./payments/payments.service";
import { ProfileService } from "./profile/profile.service";
import { RenterService } from "./renter/renter.service";
import { SportTypesService } from "./sport-types/sport-types.service";
import { UserService } from "./users/users.service";
import { VenuesService } from "./venues/venues.service";
import { DashboardService } from "./dashboard/dashboard.service";
import { ReviewsService } from "./reviews/reviews.service";
import { ReportsService } from "./reports/reports.service";
import { HomeService } from "./home/home.service";
import { CronService } from "./services/cron.service";

// Controllers
import { AuthController } from "./auth/auth.controller";
import { BookingsController } from "./bookings/bookings.controller";
import { FieldsController } from "./fields/fields.controller";
import { PaymentsController } from "./payments/payments.controller";
import { ProfileController } from "./profile/profile.controller";
import { RenterController } from "./renter/renter.controller";
import { SportTypesController } from "./sport-types/sport-types.controller";
import { UploadsController } from "./uploads/uploads.controller";
import { UsersController } from "./users/users.controller";
import { VenuesController } from "./venues/venues.controller";
import { DashboardController } from "./dashboard/dashboard.controller";
import { ReviewsController } from "./reviews/reviews.controller";
import { ReportsController } from "./reports/reports.controller";
import { HomeController } from "./home/home.controller";

// Routes
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
import { ReviewsRoute } from "./reviews/reviews.route";
import { ReportsRoute } from "./reports/reports.route";
import { HomeRoute } from "./home/home.route";

import { config } from "./config/env";
import { midtransSnap } from "./config/midtrans";

CronService.init();

const app: Express = express();
const PORT = config.PORT;

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

// Composition Root
// 1. Services

const authService = new AuthService();
const bookingsService = new BookingsService(midtransSnap);
const fieldsService = new FieldsService();
const paymentsService = new PaymentsService(bookingsService);
const profileService = new ProfileService();
const renterService = new RenterService();
const sportTypesService = new SportTypesService();
const userService = new UserService();
const venuesService = new VenuesService();
const dashboardService = new DashboardService();
const reviewsService = new ReviewsService();
const reportsService = new ReportsService();
const homeService = new HomeService();

// 2. Controllers
const authController = new AuthController(authService);
const bookingsController = new BookingsController(bookingsService);
const fieldsController = new FieldsController(fieldsService);
const paymentsController = new PaymentsController(paymentsService);
const profileController = new ProfileController(profileService);
const renterController = new RenterController(renterService);
const sportTypesController = new SportTypesController(sportTypesService);
const usersController = new UsersController(userService);
const venuesController = new VenuesController(venuesService);
const dashboardController = new DashboardController(dashboardService);
const reviewsController = new ReviewsController(reviewsService);
const reportsController = new ReportsController(reportsService);
const homeController = new HomeController(homeService);
const uploadsController = new UploadsController(
    venuesService,
    fieldsService,
    profileService
);

// 3. Routes
const authRoute = new AuthRoute(authController);
const bookingsRoute = new BookingsRoute(bookingsController);
const fieldsRoute = new FieldsRoute(fieldsController);
const paymentsRoute = new PaymentsRoute(paymentsController);
const profileRoute = new ProfileRoute(profileController);
const renterRoute = new RenterRoute(renterController);
const sportTypesRoute = new SportTypesRoute(sportTypesController);
const usersRoute = new UsersRoute(usersController);
const venuesRoute = new VenuesRoute(venuesController);
const dashboardRoute = new DashboardRoute(dashboardController);
const reviewsRoute = new ReviewsRoute(reviewsController);
const reportsRoute = new ReportsRoute(reportsController);
const homeRoute = new HomeRoute(homeController);
const uploadsRoute = new UploadsRoute(uploadsController);

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
