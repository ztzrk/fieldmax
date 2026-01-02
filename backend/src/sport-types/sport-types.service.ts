import { Prisma } from "@prisma/client";
import prisma from "../db";
import { Pagination } from "../schemas/pagination.schema";
import {
    CreateSportType,
    UpdateSportType,
} from "../schemas/sport-types.schema";
import { ConflictError, NotFoundError } from "../utils/errors";

export class SportTypesService {
    public async findAll(query: Partial<Pagination>) {
        const { page, limit, search } = query;
        const isPaginated = page !== undefined && limit !== undefined;
        const skip = isPaginated ? (page! - 1) * limit! : 0;

        const whereCondition: Prisma.SportTypeWhereInput = search
            ? { name: { contains: search, mode: "insensitive" } }
            : {};

        if (isPaginated) {
            const [sportTypes, total] = await prisma.$transaction([
                prisma.sportType.findMany({
                    where: whereCondition,
                    skip: skip,
                    take: limit,
                }),
                prisma.sportType.count({
                    where: whereCondition,
                }),
            ]);

            const totalPages = Math.ceil(total / limit!);
            return {
                data: sportTypes,
                meta: { total, page, limit, totalPages },
            };
        } else {
            const sportTypes = await prisma.sportType.findMany({
                where: whereCondition,
            });
            return { data: sportTypes };
        }
    }

    public async findById(id: string) {
        const sportType = await prisma.sportType.findUnique({ where: { id } });
        if (!sportType) throw new NotFoundError("Sport type not found");
        return sportType;
    }

    public async create(data: CreateSportType) {
        const findSportType = await prisma.sportType.findUnique({
            where: { name: data.name },
        });
        if (findSportType)
            throw new ConflictError("Sport type with this name already exists");

        const newSportType = await prisma.sportType.create({ data });
        return newSportType;
    }

    public async update(id: string, data: UpdateSportType) {
        const updatedSportType = await prisma.sportType.update({
            where: { id },
            data,
        });
        return updatedSportType;
    }

    public async delete(id: string) {
        try {
            const deletedSportType = await prisma.sportType.delete({
                where: { id },
            });
            return deletedSportType;
        } catch (error) {
            throw new ConflictError(
                "Failed to delete sport type. It might be in use by some fields."
            );
        }
    }
    public async deleteMultiple(ids: string[]) {
        const deletedSportTypes = await prisma.sportType.deleteMany({
            where: { id: { in: ids } },
        });
        return deletedSportTypes;
    }
}
