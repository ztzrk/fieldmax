// src/users/users.route.ts
import { Router, Response, NextFunction, Request } from "express";
import { UsersController } from "./users.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validationMiddleware } from "../middleware/validation.middleware";
import { updateUserSchema } from "../schemas/users.schema";
import { registerSchema as registerUserSchema } from "@fieldmax/shared";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { paginationSchema } from "../schemas/pagination.schema";

export class UsersRoute {
    public path = "/users";
    public router = Router();

    constructor(private usersController: UsersController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(this.path, authMiddleware, adminOnlyMiddleware);

        this.router.post(
            `${this.path}`,
            validationMiddleware(registerUserSchema),
            this.usersController.createUser
        );

        this.router.get(
            `${this.path}`,
            authMiddleware,
            adminOnlyMiddleware,
            validationMiddleware(paginationSchema, true),
            this.usersController.getUsers
        );

        this.router.get(`${this.path}/:id`, this.usersController.getUserById);

        this.router.put(
            `${this.path}/:id`,
            validationMiddleware(updateUserSchema),
            this.usersController.updateUser
        );

        this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);

        this.router.post(
            `${this.path}/multiple`,
            this.usersController.deleteMultipleUsers
        );
    }
}
