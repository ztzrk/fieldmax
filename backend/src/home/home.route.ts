import { Router } from "express";
import { HomeController } from "./home.controller";

export class HomeRoute {
    public router = Router();

    constructor(private homeController: HomeController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/home", this.homeController.getLandingPageData);
    }
}
