import { Request, Response } from "express";
import { VenuesService } from "./venues.service";
import { CreateVenue, UpdateVenue } from "../schemas/venues.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class VenuesController {
    constructor(private service: VenuesService) {}

    public getAll = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query; // Middleware validation
        if (req.user && req.user.role === "ADMIN") {
            const result = await this.service.findAllAdmin(query);
            sendSuccess(res, result.data, "Venues retrieved", 200, result.meta);
        } else if (req.user && req.user.role === "RENTER") {
            const result = await this.service.findAllForRenter(
                req.user.id,
                query
            );
            sendSuccess(res, result.data, "Venues retrieved", 200, result.meta);
        } else {
            const result = await this.service.findAllPublic(query);
            sendSuccess(res, result.data, "Venues retrieved", 200, result.meta);
        }
    });

    public getList = asyncHandler(async (req: Request, res: Response) => {
        let data;
        if (req.user && req.user.role === "RENTER") {
            data = await this.service.findAllListForRenter(req.user.id);
        } else {
            data = await this.service.findAllList();
        }
        sendSuccess(res, data, "Venue list retrieved");
    });

    public getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.findById(id);
        sendSuccess(res, data, "Venue details retrieved");
    });

    public create = asyncHandler(async (req: Request, res: Response) => {
        const venueData: CreateVenue = req.body;
        const data = await this.service.create(venueData, req.user!);
        sendSuccess(res, data, "Venue created successfully", 201);
    });

    public update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const venueData: UpdateVenue = req.body;
        const data = await this.service.update(id, venueData);
        sendSuccess(res, data, "Venue updated successfully");
    });

    public delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.delete(id);
        sendSuccess(res, data, "Venue deleted successfully");
    });

    public deleteMultiple = asyncHandler(
        async (req: Request, res: Response) => {
            const { ids } = req.body;
            const data = await this.service.deleteMultiple(ids, req.user);
            sendSuccess(res, data, "Venues deleted successfully");
        }
    );

    public approve = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.approve(id);
        sendSuccess(res, data, "Venue approved successfully");
    });

    public reject = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const rejectedVenue = await this.service.reject(id, data);
        sendSuccess(res, rejectedVenue, "Venue rejected successfully");
    });

    public resubmit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.resubmit(id);
        sendSuccess(res, data, "Venue resubmitted for review");
    });

    public submit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.submit(id);
        sendSuccess(res, data, "Venue submitted for review");
    });

    public deletePhoto = asyncHandler(async (req: Request, res: Response) => {
        const { photoId } = req.params;
        await this.service.deletePhoto(photoId);
        sendSuccess(res, null, "Photo deleted successfully");
    });
}
