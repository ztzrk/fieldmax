import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";
import { CreateReview } from "../schemas/reviews.schema";
import { asyncHandler } from "../utils/asyncHandler";

export class ReviewsController {
    constructor(private service: ReviewsService) {}

    public create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const data: CreateReview = req.body;
        const review = await this.service.create(userId, data);
        res.status(201).json({
            message: "Review submitted successfully",
            data: review,
        });
    });

    public getByFieldId = asyncHandler(async (req: Request, res: Response) => {
        const { fieldId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        // Parse ratings if they exist
        let ratings: number[] | undefined;
        if (req.query.ratings) {
            if (Array.isArray(req.query.ratings)) {
                ratings = (req.query.ratings as string[]).map(Number);
            } else {
                ratings = [Number(req.query.ratings)];
            }
        }

        const result = await this.service.getByFieldId(fieldId, {
            page,
            limit,
            ratings,
        });
        res.status(200).json(result);
    });
}
