import { Request, Response } from "express";
import { HomeService } from "./home.service";
import { asyncHandler } from "../utils/asyncHandler";

export class HomeController {
    constructor(private homeService: HomeService) {}

    public getLandingPageData = asyncHandler(
        async (req: Request, res: Response) => {
            const data = await this.homeService.getLandingPageData();
            res.status(200).json({ data });
        }
    );
}
