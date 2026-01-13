import { Request, Response } from "express";
import { SportTypesService } from "./sport-types.service";
import {
    CreateSportType,
    UpdateSportType,
} from "../schemas/sport-types.schema";
import { paginationSchema } from "../schemas/pagination.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class SportTypesController {
    constructor(private service: SportTypesService) {}

    public getAll = asyncHandler(async (req: Request, res: Response) => {
        const query = paginationSchema.parse(req.query);
        const result = await this.service.findAll(query);
        sendSuccess(
            res,
            result.data,
            "Sport types retrieved",
            200,
            result.meta
        );
    });

    public create = asyncHandler(async (req: Request, res: Response) => {
        const sportTypeData: CreateSportType = req.body;
        const data = await this.service.create(sportTypeData);
        sendSuccess(res, data, "Sport type created", 201);
    });

    public update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const sportTypeData: UpdateSportType = req.body;
        const data = await this.service.update(id, sportTypeData);
        sendSuccess(res, data, "Sport type updated");
    });

    public delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.delete(id);
        sendSuccess(res, data, "Sport type deleted");
    });

    public deleteMultiple = asyncHandler(
        async (req: Request, res: Response) => {
            const { ids } = req.body;
            const data = await this.service.deleteMultiple(ids);
            sendSuccess(res, data, "Sport types deleted");
        }
    );
}
