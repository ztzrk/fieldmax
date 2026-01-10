import { NextFunction, Request, Response } from "express";
import { ReviewsService } from "./reviews.service";
import { CreateReview } from "../schemas/reviews.schema";

export class ReviewsController {
    constructor(private service: ReviewsService) {}

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const data: CreateReview = req.body;
            const review = await this.service.create(userId, data);
            res.status(201).json({
                message: "Review submitted successfully",
                data: review,
            });
        } catch (error) {
            next(error);
        }
    };

    public getByFieldId = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
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
        } catch (error) {
            next(error);
        }
    };
}
