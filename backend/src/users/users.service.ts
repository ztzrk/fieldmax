// src/users/users.service.ts
import { User, Prisma } from "@prisma/client";
import { UpdateUser } from "../schemas/users.schema";
import { RegisterInput as RegisterUser } from "@fieldmax/shared";
import prisma from "../db";
import bcrypt from "bcryptjs";
import { Pagination } from "../schemas/pagination.schema";
import { ConflictError, NotFoundError } from "../utils/errors";

function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
): Omit<User, Key> {
    for (let key of keys) {
        delete user[key];
    }
    return user;
}

export class UserService {
    public async findAllUsers(query: Partial<Pagination>) {
        const { page, limit, search, role } = query;
        const pageNum = page ? Number(page) : undefined;
        const limitNum = limit ? Number(limit) : undefined;
        const isPaginated = pageNum !== undefined && limitNum !== undefined;
        const skip = isPaginated ? (pageNum! - 1) * limitNum! : 0;

        const whereCondition: Prisma.UserWhereInput = {
            ...(search
                ? {
                      OR: [
                          {
                              fullName: {
                                  contains: search,
                                  mode: "insensitive",
                              },
                          },
                          { email: { contains: search, mode: "insensitive" } },
                      ],
                  }
                : {}),
            ...(role ? { role: role } : {}),
            ...(query.isVerified !== undefined
                ? { isVerified: query.isVerified }
                : {}),
        };

        if (isPaginated) {
            const [users, total] = await prisma.$transaction([
                prisma.user.findMany({
                    where: whereCondition,
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                    skip: skip,
                    take: limitNum,
                    orderBy:
                        query.sortBy && query.sortOrder
                            ? { [query.sortBy]: query.sortOrder }
                            : { createdAt: "desc" },
                }),
                prisma.user.count({ where: whereCondition }),
            ]);

            const totalPages = Math.ceil(total / limitNum!);

            return {
                data: users,
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages,
                },
            };
        } else {
            const users = await prisma.user.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
                orderBy:
                    query.sortBy && query.sortOrder
                        ? { [query.sortBy]: query.sortOrder }
                        : { createdAt: "desc" },
            });
            return { data: users };
        }
    }

    public async findUserById(
        userId: string
    ): Promise<Omit<User, "password"> | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) throw new NotFoundError("User not found");
        return exclude(user, ["password"]);
    }

    public async updateUser(
        userId: string,
        userData: UpdateUser
    ): Promise<Omit<User, "password">> {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { ...userData },
        });
        return exclude(updatedUser, ["password"]);
    }

    public async deleteUser(userId: string): Promise<Omit<User, "password">> {
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });
        return exclude(deletedUser, ["password"]);
    }

    public async createUser(
        userData: RegisterUser
    ): Promise<Omit<User, "password">> {
        const findEmail = await prisma.user.findUnique({
            where: { email: userData.email },
        });
        if (findEmail) {
            throw new ConflictError(
                `This email ${userData.email} already exists.`
            );
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createdUser = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            },
        });

        return exclude(createdUser, ["password"]);
    }
    public async deleteMultipleUsers(userIds: string[]): Promise<void> {
        await prisma.user.deleteMany({
            where: {
                id: {
                    in: userIds,
                },
            },
        });
    }
}
