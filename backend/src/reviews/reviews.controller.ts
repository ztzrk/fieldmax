import { NextFunction, Request, Response } from "express";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dtos/create-review.dto";

export class ReviewsController {
    private service = new ReviewsService();

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;
            const data: CreateReviewDto = req.body;
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
            const result = await this.service.getByFieldId(fieldId, {
                page,
                limit,
            });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
