import { Request, Response } from "express";
import { UserService } from "./users.service";
import { UpdateUser } from "../schemas/users.schema";
import { RegisterInput as RegisterUser } from "@fieldmax/shared";
import { Pagination } from "../schemas/pagination.schema";
import { asyncHandler } from "../utils/asyncHandler";

export class UsersController {
    constructor(private userService: UserService) {}

    public createUser = asyncHandler(async (req: Request, res: Response) => {
        const userData: RegisterUser = req.body;
        const newUser = await this.userService.createUser(userData);
        res.status(201).json({ data: newUser, message: "created" });
    });

    public getUsers = asyncHandler(async (req: Request, res: Response) => {
        const query: Pagination = req.validatedQuery || req.query;
        const result = await this.userService.findAllUsers(query);
        res.status(200).json(result);
    });

    public getUserById = asyncHandler(async (req: Request, res: Response) => {
        const userId = String(req.params.id);
        const user = await this.userService.findUserById(userId);
        res.status(200).json({ data: user, message: "findOne" });
    });

    public updateUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id;
        const userData: UpdateUser = req.body;
        const updatedUser = await this.userService.updateUser(userId, userData);
        res.status(200).json({ data: updatedUser, message: "updated" });
    });

    public deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id;
        const deletedUser = await this.userService.deleteUser(userId);
        res.status(200).json({ data: deletedUser, message: "deleted" });
    });

    public deleteMultipleUsers = asyncHandler(
        async (req: Request, res: Response) => {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids)) {
                res.status(400).json({
                    message: 'Invalid input: "ids" must be an array.',
                });
                return;
            }
            await this.userService.deleteMultipleUsers(ids);
            res.status(200).json({ message: "Users deleted successfully" });
        }
    );
}
