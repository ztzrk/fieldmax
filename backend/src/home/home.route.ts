import { Router } from "express";
import { HomeController } from "./home.controller";

export class HomeRoute {
    public router = Router();
    public homeController = new HomeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/home", this.homeController.getLandingPageData);
    }
}
