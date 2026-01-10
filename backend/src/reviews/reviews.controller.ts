import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";
import { CreateReview, GetReviewsQuery } from "../schemas/reviews.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class ReviewsController {
    constructor(private service: ReviewsService) {}

    public create = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const data: CreateReview = req.body;
        const review = await this.service.create(userId, data);
        sendSuccess(res, review, "Review submitted successfully", 201);
    });

    public getByFieldId = asyncHandler(async (req: Request, res: Response) => {
        const { fieldId } = req.params;
        const query = req.query as unknown as GetReviewsQuery;

        const result = await this.service.getByFieldId(fieldId, {
            page: query.page || 1,
            limit: query.limit || 10,
            ratings: query.ratings,
        });
        sendSuccess(res, result.data, "Reviews retrieved", 200, result.meta);
    });
}
