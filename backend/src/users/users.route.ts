import { Router } from "express";
import { UsersController } from "./users.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import {
    createUserSchema,
    updateUserSchema,
    deleteMultipleUsersSchema,
} from "../schemas/users.schema";
import { adminOnlyMiddleware } from "../middleware/admin.middleware";
import { paginationSchema } from "../schemas/pagination.schema";
import { z } from "zod";

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
            validateRequest(z.object({ body: createUserSchema })),
            this.usersController.createUser
        );

        this.router.get(
            `${this.path}`,
            authMiddleware,
            adminOnlyMiddleware,
            validateRequest(z.object({ query: paginationSchema })),
            this.usersController.getUsers
        );

        this.router.get(`${this.path}/:id`, this.usersController.getUserById);

        this.router.put(
            `${this.path}/:id`,
            validateRequest(z.object({ body: updateUserSchema })),
            this.usersController.updateUser
        );

        this.router.delete(`${this.path}/:id`, this.usersController.deleteUser);

        this.router.post(
            `${this.path}/multiple`,
            validateRequest(z.object({ body: deleteMultipleUsersSchema })),
            this.usersController.deleteMultipleUsers
        );
    }
}
