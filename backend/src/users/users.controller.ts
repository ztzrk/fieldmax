// src/users/users.controller.ts
import { NextFunction, Request, Response } from "express";
import { UserService } from "./users.service";
import { UpdateUser } from "../schemas/users.schema";
import { RegisterUser } from "../schemas/auth.schema";
import { Pagination } from "../schemas/pagination.schema";

export class UsersController {
    constructor(private userService: UserService) {}

    public createUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userData: RegisterUser = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json({ data: newUser, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public getUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const query: Pagination = req.validatedQuery || req.query;
            const result = await this.userService.findAllUsers(query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    public getUserById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = String(req.params.id);
            const user = await this.userService.findUserById(userId);
            res.status(200).json({ data: user, message: "findOne" });
        } catch (error) {
            next(error);
        }
    };

    public updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.id;
            const userData: UpdateUser = req.body;
            const updatedUser = await this.userService.updateUser(
                userId,
                userData
            );
            res.status(200).json({ data: updatedUser, message: "updated" });
        } catch (error) {
            next(error);
        }
    };

    public deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const userId = req.params.id;
            const deletedUser = await this.userService.deleteUser(userId);
            res.status(200).json({ data: deletedUser, message: "deleted" });
        } catch (error) {
            next(error);
        }
    };
    public deleteMultipleUsers = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids)) {
                res.status(400).json({
                    message: 'Invalid input: "ids" must be an array.',
                });
                return;
            }
            await this.userService.deleteMultipleUsers(ids);
            res.status(200).json({ message: "Users deleted successfully" });
        } catch (error) {
            next(error);
        }
    };
}
