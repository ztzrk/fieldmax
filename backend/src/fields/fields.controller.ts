import { Request, Response } from "express";
import { FieldsService } from "./fields.service";
import {
    CreateField,
    UpdateField,
    RejectField,
    ToggleFieldClosure,
    DeleteMultipleFields,
    ScheduleOverride,
    GetAvailability,
} from "../schemas/fields.schema";
import { Pagination } from "../schemas/pagination.schema";
import { asyncHandler } from "../utils/asyncHandler";

export class FieldsController {
    constructor(private service: FieldsService) {}

    public getAll = asyncHandler(async (req: Request, res: Response) => {
        const query =
            req.validatedQuery || (req.query as unknown as Pagination);
        if (req.user && req.user.role === "RENTER") {
            const data = await this.service.findAllForRenter(
                req.user.id,
                query
            );
            res.status(200).json(data);
        } else {
            if (!req.user) {
                query.status = "APPROVED";
            }
            const data = await this.service.findAll(query);
            res.status(200).json(data);
        }
    });

    public getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
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

        const data = await this.service.findById(id, {
            page,
            limit,
            ratings,
        });
        res.status(200).json({ data, message: "findOne" });
    });

    public create = asyncHandler(async (req: Request, res: Response) => {
        const fieldData: CreateField = req.body;
        const data = await this.service.create(fieldData, req.user!);
        res.status(201).json({ data, message: "created" });
    });

    public update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const fieldData: UpdateField = req.body;
        const data = await this.service.update(id, fieldData, req.user!);
        res.status(200).json({ data, message: "updated" });
    });

    public delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.delete(id, req.user!);
        res.status(200).json({ data, message: "deleted" });
    });

    public deleteMultiple = asyncHandler(
        async (req: Request, res: Response) => {
            const { ids }: DeleteMultipleFields = req.body;
            const data = await this.service.deleteMultiple(ids, req.user);
            res.status(200).json({ data, message: "deleted multiple" });
        }
    );

    public getOverrides = asyncHandler(async (req: Request, res: Response) => {
        const { fieldId } = req.params;
        const data = await this.service.getOverrides(fieldId);
        res.status(200).json({ data });
    });

    public createOverride = asyncHandler(
        async (req: Request, res: Response) => {
            const { fieldId } = req.params;
            const overrideData: ScheduleOverride = req.body;
            const data = await this.service.createOverride(
                fieldId,
                overrideData
            );
            res.status(201).json({ data, message: "created" });
        }
    );

    public deleteOverride = asyncHandler(
        async (req: Request, res: Response) => {
            const { overrideId } = req.params;
            const data = await this.service.deleteOverride(overrideId);
            res.status(200).json({ data, message: "deleted" });
        }
    );

    public deletePhoto = asyncHandler(async (req: Request, res: Response) => {
        const { photoId } = req.params;
        const data = await this.service.deletePhoto(photoId);
        res.status(200).json({ data, message: "deleted photo" });
    });

    public getAvailability = asyncHandler(
        async (req: Request, res: Response) => {
            const { fieldId } = req.params;
            const query = req.query as unknown as GetAvailability;
            const data = await this.service.getAvailability(fieldId, query);
            res.status(200).json({ data });
        }
    );

    public approve = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.approve(id);
        res.status(200).json({ data, message: "field approved" });
    });

    public reject = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data: RejectField = req.body;
        const rejectedField = await this.service.reject(id, data);
        res.status(200).json({
            data: rejectedField,
            message: "field rejected",
        });
    });

    public resubmit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.resubmit(id);
        res.status(200).json({
            data,
            message: "Field resubmitted for review",
        });
    });

    public toggleClosure = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { isClosed }: ToggleFieldClosure = req.body;
        const data = await this.service.toggleClosure(id, isClosed, req.user!);
        res.status(200).json({
            data,
            message: isClosed ? "Field closed" : "Field opened",
        });
    });
}
