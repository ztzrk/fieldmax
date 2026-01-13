import { Request, Response } from "express";
import { FieldsService } from "./fields.service";
import {
    CreateField,
    UpdateField,
    RejectField,
    ToggleFieldClosure,
    DeleteMultipleFields,
    GetAvailability,
} from "../schemas/fields.schema";
import { Pagination } from "../schemas/pagination.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class FieldsController {
    constructor(private service: FieldsService) {}

    public getAll = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as Pagination;
        if (req.user && req.user.role === "RENTER") {
            const data = await this.service.findAllForRenter(
                req.user.id,
                query
            );
            sendSuccess(res, data.data, "Fields retrieved", 200, data.meta);
        } else {
            if (!req.user) {
                query.status = "APPROVED";
            }
            const data = await this.service.findAll(query);
            sendSuccess(res, data.data, "Fields retrieved", 200, data.meta);
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
        sendSuccess(res, data, "Field details retrieved");
    });

    public create = asyncHandler(async (req: Request, res: Response) => {
        const fieldData: CreateField = req.body;
        const data = await this.service.create(fieldData, req.user!);
        sendSuccess(res, data, "Field created successfully", 201);
    });

    public update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const fieldData: UpdateField = req.body;
        const data = await this.service.update(id, fieldData, req.user!);
        sendSuccess(res, data, "Field updated successfully");
    });

    public delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.delete(id, req.user!);
        sendSuccess(res, data, "Field deleted successfully");
    });

    public deleteMultiple = asyncHandler(
        async (req: Request, res: Response) => {
            const { ids }: DeleteMultipleFields = req.body;
            const data = await this.service.deleteMultiple(ids, req.user);
            sendSuccess(res, data, "Fields deleted successfully");
        }
    );

    public deletePhoto = asyncHandler(async (req: Request, res: Response) => {
        const { photoId } = req.params;
        const data = await this.service.deletePhoto(photoId);
        sendSuccess(res, data, "Photo deleted successfully");
    });

    public getAvailability = asyncHandler(
        async (req: Request, res: Response) => {
            const { fieldId } = req.params;
            const query = req.query as unknown as GetAvailability;
            const data = await this.service.getAvailability(fieldId, query);
            sendSuccess(res, data, "Availability retrieved");
        }
    );

    public approve = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.approve(id);
        sendSuccess(res, data, "Field approved successfully");
    });

    public reject = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data: RejectField = req.body;
        const rejectedField = await this.service.reject(id, data);
        sendSuccess(res, rejectedField, "Field rejected successfully");
    });

    public resubmit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.resubmit(id);
        sendSuccess(res, data, "Field resubmitted for review");
    });

    public toggleClosure = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { isClosed }: ToggleFieldClosure = req.body;
        const data = await this.service.toggleClosure(id, isClosed, req.user!);
        sendSuccess(res, data, isClosed ? "Field closed" : "Field opened");
    });
}
