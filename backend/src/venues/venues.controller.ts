import { Request, Response } from "express";
import { VenuesService } from "./venues.service";
import { CreateVenue, UpdateVenue } from "../schemas/venues.schema";
import { asyncHandler } from "../utils/asyncHandler";

export class VenuesController {
    constructor(private service: VenuesService) {}

    public getAll = asyncHandler(async (req: Request, res: Response) => {
        const query = req.validatedQuery || req.query;
        if (req.user && req.user.role === "ADMIN") {
            const data = await this.service.findAllAdmin(query);
            res.status(200).json(data);
        } else if (req.user && req.user.role === "RENTER") {
            const data = await this.service.findAllForRenter(
                req.user.id,
                query
            );
            res.status(200).json(data);
        } else {
            const data = await this.service.findAllPublic(query);
            res.status(200).json(data);
        }
    });

    public getList = asyncHandler(async (req: Request, res: Response) => {
        let data;
        if (req.user && req.user.role === "RENTER") {
            data = await this.service.findAllListForRenter(req.user.id);
        } else {
            data = await this.service.findAllList();
        }
        res.status(200).json({ data });
    });

    public getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.findById(id);
        res.status(200).json({ data, message: "findOne" });
    });

    public create = asyncHandler(async (req: Request, res: Response) => {
        const venueData: CreateVenue = req.body;
        const data = await this.service.create(venueData, req.user!);
        res.status(201).json({ data, message: "created" });
    });

    public update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const venueData: UpdateVenue = req.body;
        const data = await this.service.update(id, venueData);
        res.status(200).json({ data, message: "updated" });
    });

    public delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.delete(id);
        res.status(200).json({ data, message: "deleted" });
    });

    public deleteMultiple = asyncHandler(
        async (req: Request, res: Response) => {
            const { ids } = req.body;
            const data = await this.service.deleteMultiple(ids, req.user);
            res.status(200).json({ data, message: "deleted multiple" });
        }
    );

    public approve = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.approve(id);
        res.status(200).json({ data, message: "venue approved" });
    });

    public reject = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = req.body;
        const rejectedVenue = await this.service.reject(id, data);
        res.status(200).json({
            data: rejectedVenue,
            message: "venue rejected",
        });
    });

    public resubmit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.resubmit(id);
        res.status(200).json({
            data,
            message: "Venue resubmitted for review",
        });
    });

    public submit = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await this.service.submit(id);
        res.status(200).json({
            data,
            message: "Venue submitted for review",
        });
    });

    public deletePhoto = asyncHandler(async (req: Request, res: Response) => {
        const { photoId } = req.params;
        await this.service.deletePhoto(photoId);
        res.status(200).json({ message: "Photo deleted" });
    });
}
