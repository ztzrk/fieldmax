import { NextFunction, Request, Response } from "express";
import { SportTypesService } from "./sport-types.service";
import {
    CreateSportType,
    UpdateSportType,
} from "../schemas/sport-types.schema";
import { Pagination } from "../schemas/pagination.schema";

export class SportTypesController {
    public service = new SportTypesService();

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query: Pagination = req.validatedQuery || req.query;
            const result = await this.service.findAll(query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sportTypeData: CreateSportType = req.body;
            const data = await this.service.create(sportTypeData);
            res.status(201).json({ data, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const sportTypeData: UpdateSportType = req.body;
            const data = await this.service.update(id, sportTypeData);
            res.status(200).json({ data, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = await this.service.delete(id);
            res.status(200).json({ data, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

    public deleteMultiple = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { ids } = req.body;
            const data = await this.service.deleteMultiple(ids);
            res.status(200).json({ data, message: "deleted multiple" });
        } catch (error) {
            next(error);
        }
    };
}
