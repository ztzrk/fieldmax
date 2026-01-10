// src/users/users.controller.ts
import { Request, Response } from "express";
import { UserService } from "./users.service";
import { UpdateUser } from "../schemas/users.schema";
import { RegisterInput as RegisterUser } from "@fieldmax/shared";
import { Pagination } from "../schemas/pagination.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export class UsersController {
    constructor(private userService: UserService) {}

    public createUser = asyncHandler(async (req: Request, res: Response) => {
        const userData: RegisterUser = req.body;
        const newUser = await this.userService.createUser(userData);
        sendSuccess(res, newUser, "User created successfully", 201);
    });

    public getUsers = asyncHandler(async (req: Request, res: Response) => {
        const query: Pagination = req.query; // Middleware now validates query
        const result = await this.userService.findAllUsers(query);
        sendSuccess(
            res,
            result.data,
            "Users retrieved successfully",
            200,
            result.meta
        );
    });

    public getUserById = asyncHandler(async (req: Request, res: Response) => {
        const userId = String(req.params.id);
        const user = await this.userService.findUserById(userId);
        sendSuccess(res, user, "User retrieved successfully");
    });

    public updateUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id;
        const userData: UpdateUser = req.body;
        const updatedUser = await this.userService.updateUser(userId, userData);
        sendSuccess(res, updatedUser, "User updated successfully");
    });

    public deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.params.id;
        const deletedUser = await this.userService.deleteUser(userId);
        sendSuccess(res, deletedUser, "User deleted successfully");
    });

    public deleteMultipleUsers = asyncHandler(
        async (req: Request, res: Response) => {
            const { ids } = req.body;
            await this.userService.deleteMultipleUsers(ids);
            sendSuccess(res, null, "Users deleted successfully");
        }
    );
}
