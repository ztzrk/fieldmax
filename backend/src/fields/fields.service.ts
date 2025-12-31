import { Prisma, User } from "@prisma/client";
import imagekit from "../lib/imagekit";
import prisma from "../db";
import { CreateFieldDto, UpdateFieldDto } from "./dtos/field.dto";
import { ScheduleOverrideDto } from "./dtos/override.dto";
import { GetAvailabilityDto } from "./dtos/availability.dtos";
import { PaginationDto } from "../dtos/pagination.dto";
import { NotFoundError, ValidationError } from "../utils/errors";

export class FieldsService {
    public async findAll(query: PaginationDto) {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            isClosed,
            sportTypeId,
        } = query;
        const skip = (page - 1) * limit;
        const whereCondition: Prisma.FieldWhereInput = {
            ...(search
                ? {
                      name: {
                          contains: search,
                          mode: "insensitive",
                      },
                  }
                : {}),
            ...(status ? { status } : {}),
            ...(typeof isClosed === "boolean" ? { isClosed } : {}),
            ...(sportTypeId ? { sportTypeId } : {}),
        };
        const [fields, total] = [
            await prisma.field.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    name: true,
                    isClosed: true,
                    pricePerHour: true,
                    status: true,
                    sportType: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    venue: {
                        select: {
                            name: true,
                        },
                    },
                    photos: {
                        take: 1,
                        select: {
                            url: true,
                        },
                    },
                },
                orderBy: {
                    venue: {
                        name: "asc",
                    },
                },
                skip: skip,
                take: limit,
            }),
            await prisma.field.count({ where: whereCondition }),
        ];
        const totalPages = Math.ceil(total / limit);
        return {
            data: fields,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    public async findAllForRenter(renterId: string, query: PaginationDto) {
        const { page = 1, limit = 10, search, sportTypeId } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.FieldWhereInput = {
            venue: {
                renterId: renterId,
            },
            ...(search
                ? {
                      name: {
                          contains: search,
                          mode: "insensitive",
                      },
                  }
                : {}),
            ...(sportTypeId ? { sportTypeId } : {}),
        };

        const [fields, total] = [
            await prisma.field.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    name: true,
                    isClosed: true,
                    pricePerHour: true,
                    status: true,
                    sportType: {
                        select: {
                            name: true,
                        },
                    },
                    venue: {
                        select: {
                            name: true,
                        },
                    },
                    photos: {
                        take: 1,
                        select: {
                            url: true,
                        },
                    },
                },
                orderBy: {
                    venue: {
                        name: "asc",
                    },
                },
                skip,
                take: limit,
            }),
            await prisma.field.count({ where: whereCondition }),
        ];

        const totalPages = Math.ceil(total / limit);

        return {
            data: fields,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    public async findById(id: string) {
        const [field, rating] = await prisma.$transaction([
            prisma.field.findUnique({
                where: { id },
                include: {
                    sportType: true,
                    venue: {
                        include: {
                            schedules: true,
                        },
                    },
                    photos: true,
                },
            }),
            prisma.review.aggregate({
                _avg: { rating: true },
                _count: { rating: true },
                where: { fieldId: id },
            }),
        ]);

        if (!field) throw new Error("Field not found");

        return {
            ...field,
            rating: rating._avg.rating || 0,
            reviewCount: rating._count.rating || 0,
        };
    }

    public async create(data: CreateFieldDto, user: User) {
        const venue = await prisma.venue.findUnique({
            where: { id: data.venueId },
        });
        if (!venue) throw new Error("Venue not found.");

        if (venue.status !== "APPROVED") {
            throw new ValidationError(
                "Fields can only be added to approved venues."
            );
        }

        if (user.role === "RENTER" && venue.renterId !== user.id) {
            throw new Error("Forbidden: You do not own this venue.");
        }

        return prisma.field.create({ data: data });
    }

    public async update(fieldId: string, data: UpdateFieldDto, user: User) {
        const fieldToUpdate = await prisma.field.findUnique({
            where: { id: fieldId },
            select: { venue: { select: { renterId: true } } },
        });
        if (!fieldToUpdate) throw new Error("Field not found.");

        if (
            user.role === "RENTER" &&
            fieldToUpdate.venue.renterId !== user.id
        ) {
            throw new Error("Forbidden: You do not own this field.");
        }

        return prisma.field.update({
            where: { id: fieldId },
            data: data,
        });
    }

    public async delete(fieldId: string, user: User) {
        const fieldToDelete = await prisma.field.findUnique({
            where: { id: fieldId },
            select: { venue: { select: { renterId: true } } },
        });
        if (!fieldToDelete) throw new Error("Field not found.");

        if (
            user.role === "RENTER" &&
            fieldToDelete.venue.renterId !== user.id
        ) {
            throw new Error("Forbidden: You do not own this field.");
        }

        return prisma.field.delete({ where: { id: fieldId } });
    }

    public async deleteMultiple(ids: string[], user?: User) {
        if (user && user.role === "RENTER") {
            const fieldsToCheck = await prisma.field.findMany({
                where: {
                    id: { in: ids },
                    venue: { renterId: user.id },
                },
                select: { id: true },
            });

            if (fieldsToCheck.length !== ids.length) {
                throw new Error(
                    "Forbidden: You do not own all the fields you are trying to delete."
                );
            }
        }

        const deletedFields = await prisma.field.deleteMany({
            where: { id: { in: ids } },
        });
        return deletedFields;
    }

    public async approve(id: string) {
        const fieldWithPhotoCount = await prisma.field.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { photos: true },
                },
            },
        });

        if (!fieldWithPhotoCount) {
            throw new NotFoundError("Field not found.");
        }

        if (fieldWithPhotoCount._count.photos < 1) {
            throw new ValidationError(
                "Field must have at least 1 photo to be approved."
            );
        }

        return prisma.field.update({
            where: { id },
            data: { status: "APPROVED" },
        });
    }

    public async reject(id: string, data: { rejectionReason: string }) {
        return prisma.field.update({
            where: { id },
            data: {
                status: "REJECTED",
                rejectionReason: data.rejectionReason,
            },
        });
    }

    public async resubmit(id: string) {
        const fieldToUpdate = await prisma.field.findUnique({ where: { id } });

        if (!fieldToUpdate) {
            throw new NotFoundError("Field not found.");
        }

        if (fieldToUpdate.status !== "REJECTED") {
            throw new ValidationError(
                "Only rejected fields can be resubmitted."
            );
        }

        return prisma.field.update({
            where: { id },
            data: {
                status: "PENDING",
                rejectionReason: null,
            },
        });
    }

    public async getOverrides(fieldId: string) {
        const overrides = await prisma.scheduleOverride.findMany({
            where: { fieldId },
            orderBy: { overrideDate: "asc" },
        });
        return overrides;
    }

    public async createOverride(fieldId: string, data: ScheduleOverrideDto) {
        const newOverride = await prisma.scheduleOverride.create({
            data: {
                fieldId,
                ...data,
            },
        });
        return newOverride;
    }

    public async deleteOverride(overrideId: string) {
        const deletedOverride = await prisma.scheduleOverride.delete({
            where: { id: overrideId },
        });
        return deletedOverride;
    }

    public async addPhotos(
        fieldId: string,
        files: Express.Multer.File[],
        user: User
    ) {
        const uploadPromises = files.map((file) => {
            const cleanName = file.originalname.trim().replace(/\s+/g, "-");
            const fileName = `${fieldId}-${Date.now()}-${cleanName}`;

            return imagekit.upload({
                file: file.buffer,
                fileName: fileName,
                folder: "field-photos",
            });
        });

        const uploadResults = await Promise.all(uploadPromises);

        const photoDataToSave = uploadResults.map((result) => {
            return { fieldId, url: result.url };
        });

        return prisma.fieldPhoto.createMany({ data: photoDataToSave });
    }

    public async deletePhoto(photoId: string) {
        const photo = await prisma.fieldPhoto.findUnique({
            where: { id: photoId },
        });
        if (!photo) throw new Error("Photo not found");

        // Similar to venue photos, we're skipping actual deletion from ImageKit
        // as we lack the fileId in the schema.
        // If strict cleanup was required, we'd need to store fileId from the upload result.

        return prisma.fieldPhoto.delete({
            where: { id: photoId },
        });
    }

    public async getAvailability(fieldId: string, query: GetAvailabilityDto) {
        const field = await prisma.field.findUnique({
            where: { id: fieldId },
            select: { isClosed: true, venueId: true },
        });

        if (!field || field.isClosed) {
            return [];
        }

        const requestedDate = this.parseDate(query.date);
        const dayOfWeek = requestedDate.getUTCDay();

        const override = await prisma.scheduleOverride.findFirst({
            where: {
                fieldId: fieldId,
                overrideDate: requestedDate,
            },
        });

        let openHour: number | null = null;
        let closeHour: number | null = null;
        let isClosed = false;

        if (override) {
            if (
                override.isClosed ||
                !override.openTime ||
                !override.closeTime
            ) {
                isClosed = true;
            } else {
                openHour = override.openTime.getUTCHours();
                closeHour = override.closeTime.getUTCHours();
            }
        } else {
            const regularSchedules = await prisma.venueSchedule.findMany({
                where: { venueId: field.venueId, dayOfWeek: dayOfWeek },
            });
            if (regularSchedules.length > 0) {
                openHour = regularSchedules[0].openTime.getUTCHours();
                closeHour = regularSchedules[0].closeTime.getUTCHours();
            } else {
                isClosed = true;
            }
        }

        if (isClosed || openHour === null || closeHour === null) {
            return [];
        }

        const possibleSlots = [];
        for (let hour = openHour; hour < closeHour; hour++) {
            possibleSlots.push(`${hour.toString().padStart(2, "0")}:00`);
        }

        const bookings = await prisma.booking.findMany({
            where: {
                fieldId: fieldId,
                bookingDate: requestedDate,
                status: {
                    in: ["CONFIRMED", "PENDING"],
                },
            },
            select: {
                startTime: true,
                endTime: true, // Need end time for range blocking
            },
        });

        const bookedSlots = new Set<string>();

        bookings.forEach((booking) => {
            // Shift UTC to WIB (+7)
            const start = (booking.startTime.getUTCHours() + 7) % 24;
            // Calculate end hour. If end < start, it means it wrapped to next day (add 24)
            let end = (booking.endTime.getUTCHours() + 7) % 24;
            if (end <= start) end += 24;

            for (let h = start; h < end; h++) {
                const hourString = `${(h % 24).toString().padStart(2, "0")}:00`;
                bookedSlots.add(hourString);
            }
        });

        const availableSlots = possibleSlots.filter(
            (slot) => !bookedSlots.has(slot)
        );

        return availableSlots;
    }

    public async toggleClosure(fieldId: string, isClosed: boolean, user: User) {
        const field = await prisma.field.findUnique({
            where: { id: fieldId },
            include: { venue: true },
        });

        if (!field) throw new NotFoundError("Field not found.");

        if (user.role === "RENTER" && field.venue.renterId !== user.id) {
            throw new Error("Forbidden: You do not own this field.");
        }

        return prisma.field.update({
            where: { id: fieldId },
            data: { isClosed },
        });
    }

    private parseDate(dateString: string): Date {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new ValidationError("Invalid date provided.");
        }
        return date;
    }
}
