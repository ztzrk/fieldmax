import { Prisma, User } from "@prisma/client";
import imagekit from "../lib/imagekit";
import prisma from "../db";
import { format, addHours, areIntervalsOverlapping } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
    CreateField,
    UpdateField,
    GetAvailability,
} from "../schemas/fields.schema";
import { Pagination } from "../schemas/pagination.schema";
import { NotFoundError, ValidationError } from "../utils/errors";

export class FieldsService {
    public async findAll(query: Pagination) {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            isClosed,
            sportTypeId,
        } = query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
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
                orderBy:
                    query.sortBy && query.sortOrder
                        ? query.sortBy.includes(".") &&
                          (query.sortBy.split(".")[0] === "venue" ||
                              query.sortBy.split(".")[0] === "sportType")
                            ? {
                                  [query.sortBy.split(".")[0]]: {
                                      [query.sortBy.split(".")[1]]:
                                          query.sortOrder,
                                  },
                              }
                            : { [query.sortBy]: query.sortOrder }
                        : {
                              venue: {
                                  name: "asc",
                              },
                          },
                skip: skip,
                take: limitNum,
            }),
            await prisma.field.count({ where: whereCondition }),
        ];
        // ... (lines 87-103 omitted for brevity, assuming they don't use 'limit' or 'page' directly in a way that breaks)

        const fieldIds = fields.map((f) => f.id);

        const aggregations = await prisma.review.groupBy({
            by: ["fieldId"],
            _avg: { rating: true },
            _count: { rating: true },
            where: { fieldId: { in: fieldIds } },
        });

        const fieldsWithRating = fields.map((field) => {
            const stats = aggregations.find((a) => a.fieldId === field.id);
            return {
                ...field,
                rating: stats?._avg?.rating || 0,
                reviewCount: stats?._count?.rating || 0,
            };
        });

        const totalPages = Math.ceil(total / limitNum);
        return {
            data: fieldsWithRating,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
            },
        };
    }

    public async findAllForRenter(renterId: string, query: Pagination) {
        const { page = 1, limit = 10, search, sportTypeId } = query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

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
                take: limitNum,
            }),
            await prisma.field.count({ where: whereCondition }),
        ];

        const totalPages = Math.ceil(total / limitNum);

        return {
            data: fields,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
            },
        };
    }

    public async findById(id: string, reviewQuery?: any) {
        const { page = 1, limit = 10, ratings } = reviewQuery || {};
        const skip = (page - 1) * limit;

        const reviewWhere: any = { fieldId: id };
        if (ratings && ratings.length > 0) {
            reviewWhere.rating = { in: ratings };
        }

        const [field, rating, reviews, totalReviews, ratingGroup] =
            await prisma.$transaction([
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
                prisma.review.findMany({
                    where: reviewWhere,
                    include: {
                        user: {
                            select: {
                                fullName: true,
                                profile: {
                                    select: {
                                        profilePictureUrl: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    skip: Number(skip),
                    take: Number(limit),
                }),
                prisma.review.count({ where: reviewWhere }),
                prisma.review.groupBy({
                    by: ["rating"],
                    _count: {
                        rating: true,
                    },
                    where: { fieldId: id },
                    orderBy: { rating: "desc" },
                }),
            ]);

        if (!field) throw new Error("Field not found");

        const totalPages = Math.ceil(totalReviews / limit);

        const response = {
            ...field,
            rating: rating._avg.rating || 0,
            reviewCount: rating._count.rating || 0,
            reviews: {
                data: reviews,
                meta: {
                    total: totalReviews,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages,
                },
            },
        };
        return response;
    }

    public async create(data: CreateField, user: User) {
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

    public async update(fieldId: string, data: UpdateField, user: User) {
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

    public async getAvailability(fieldId: string, query: GetAvailability) {
        const TIMEZONE = "Asia/Jakarta"; // TODO: Make this dynamic from Venue
        const field = await prisma.field.findUnique({
            where: { id: fieldId },
            select: { isClosed: true, venueId: true },
        });

        if (!field || field.isClosed) {
            return [];
        }

        // 1. Parse requested date in Venue Timezone
        const requestDate = toZonedTime(query.date, TIMEZONE);
        const dayOfWeek = requestDate.getDay(); // 0 = Sunday

        // 2. Check for Regular Schedule
        let openTime: Date | null = null;
        let closeTime: Date | null = null;

        const regularSchedule = await prisma.venueSchedule.findFirst({
            where: { venueId: field.venueId, dayOfWeek: dayOfWeek },
        });
        if (regularSchedule) {
            openTime = this.combineDateAndTime(
                requestDate,
                regularSchedule.openTime,
                TIMEZONE
            );
            closeTime = this.combineDateAndTime(
                requestDate,
                regularSchedule.closeTime,
                TIMEZONE
            );
        }

        if (!openTime || !closeTime) return [];

        // 3. Get Bookings for this Range
        // We look for bookings that overlap with our operating window
        const bookings = await prisma.booking.findMany({
            where: {
                fieldId: fieldId,
                status: { in: ["CONFIRMED", "PENDING"] },
                // Overlap formula: StartA < EndB AND EndA > StartB
                startTime: { lt: closeTime },
                endTime: { gt: openTime },
            },
            select: { startTime: true, endTime: true },
        });

        // 4. Generate Slots (Hourly for now)
        const slots: string[] = [];
        let currentSlot = openTime;

        // Loop until we reach closeTime.
        // Assuming 1 hour slots.
        while (addHours(currentSlot, 1) <= closeTime) {
            const slotEnd = addHours(currentSlot, 1);
            const slotInterval = { start: currentSlot, end: slotEnd };

            // Check if this slot overlaps with ANY booking
            const isBooked = bookings.some((booking) =>
                areIntervalsOverlapping(slotInterval, {
                    start: booking.startTime,
                    end: booking.endTime,
                })
            );

            if (!isBooked) {
                // Format output as HH:mm
                slots.push(format(currentSlot, "HH:mm"));
            }

            currentSlot = addHours(currentSlot, 1);
        }

        return slots;
    }

    private combineDateAndTime(
        baseDate: Date,
        timeDate: Date,
        timezone: string
    ): Date {
        // Extract hour/minute from the database Time object (which is UTC-ish 1970)
        // Note: Prisma stores @db.Time as a Date object on 1970-01-01.
        // When we read it, it comes as a JS Date.
        // We want to apply ITS hours/minutes to OUR baseDate in the target Timezone.

        // Get HH:mm from the source time (in UTC, since that's how Prisma typically gives it back for Time columns)
        // OR better: use format to extract the string "HH:mm" from the time object
        const timeString = format(timeDate, "HH:mm"); // e.g. "16:00"

        // Create a string "YYYY-MM-DD HH:mm"
        const dateString = format(baseDate, "yyyy-MM-dd");
        const combinedString = `${dateString} ${timeString}`;

        // Parse this string BACK into a Date object in the target timezone
        return toZonedTime(combinedString, timezone);
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
