import { Request, Response } from "express";
import { HomeService } from "./home.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class HomeController {
    constructor(private homeService: HomeService) {}

    public getLandingPageData = asyncHandler(
        async (req: Request, res: Response) => {
            const data = await this.homeService.getLandingPageData();
            sendSuccess(res, data, "Landing page data retrieved");
        }
    );
}
