import { Request, Response, NextFunction } from "express";
import { HomeService } from "./home.service";

export class HomeController {
    private homeService = new HomeService();

    public getLandingPageData = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const data = await this.homeService.getLandingPageData();
            res.status(200).json({ data });
        } catch (error) {
            next(error);
        }
    };
}
