import { Prisma } from "@prisma/client";
import prisma from "../db";
import { Pagination } from "../schemas/pagination.schema";
import { NotFoundError, ValidationError } from "../utils/errors";

export class RenterService {
    public async findMyVenues(renterId: string) {
        return prisma.venue.findMany({
            where: { renterId },
            include: {
                photos: true,
                _count: {
                    select: { fields: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    public async findMyVenueById(renterId: string, venueId: string) {
        return prisma.venue.findFirst({
            where: { id: venueId, renterId },
            include: {
                photos: true,
                _count: {
                    select: { fields: true },
                },
            },
        });
    }

    public async findMyBookings(renterId: string) {
        return prisma.booking.findMany({
            where: {
                field: {
                    venue: {
                        renterId,
                    },
                },
            },
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    public async findMyBookingById(renterId: string, bookingId: string) {
        return prisma.booking.findFirst({
            where: {
                id: bookingId,
                field: {
                    venue: {
                        renterId,
                    },
                },
            },
            include: {
                field: {
                    include: {
                        venue: true,
                    },
                },
            },
        });
    }

    public async confirmBooking(renterId: string, bookingId: string) {
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                field: { venue: { renterId } },
            },
        });
        if (!booking) {
            throw new NotFoundError("Booking not found or not owned by you.");
        }

        return prisma.$transaction(async (tx) => {
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: "CONFIRMED" },
            });
            await tx.payment.updateMany({
                where: { bookingId },
                data: { status: "PAID" },
            });
            return updatedBooking;
        });
    }

    public async cancelBooking(renterId: string, bookingId: string) {
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                field: { venue: { renterId } },
            },
        });
        if (!booking) {
            throw new NotFoundError("Booking not found or not owned by you.");
        }

        return prisma.$transaction(async (tx) => {
            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: "CANCELLED" },
            });
            await tx.payment.updateMany({
                where: { bookingId },
                data: { status: "FAILED" },
            });
            return updatedBooking;
        });
    }

    public async completeBooking(renterId: string, bookingId: string) {
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                field: { venue: { renterId } },
            },
        });
        if (!booking) {
            throw new NotFoundError("Booking not found or not owned by you.");
        }

        return prisma.booking.update({
            where: { id: bookingId },
            data: { status: "COMPLETED" },
        });
    }

    public async checkInBooking(renterId: string, rawCode: string) {
        const normalized = rawCode
            .trim()
            .replace(/^FIELDMAX:/i, "")
            .replace(/^#/, "")
            .toLowerCase();

        if (!normalized) {
            throw new ValidationError("Kode tiket tidak boleh kosong.");
        }

        const isUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                normalized
            );

        const booking = isUuid
            ? await prisma.booking.findFirst({
                  where: {
                      id: normalized,
                      field: { venue: { renterId } },
                  },
                  include: {
                      user: {
                          select: { id: true, fullName: true, email: true },
                      },
                      field: { include: { venue: true } },
                      payment: true,
                  },
              })
            : await prisma.booking.findFirst({
                  where: {
                      id: { startsWith: normalized },
                      field: { venue: { renterId } },
                  },
                  include: {
                      user: {
                          select: { id: true, fullName: true, email: true },
                      },
                      field: { include: { venue: true } },
                      payment: true,
                  },
              });

        if (!booking) {
            throw new NotFoundError(
                "Tiket tidak ditemukan atau bukan milik tempat olahraga Anda."
            );
        }

        if (booking.status === "PENDING") {
            throw new ValidationError(
                "Tiket belum dibayar. Selesaikan pembayaran terlebih dahulu."
            );
        }

        if (booking.status === "CANCELLED" || booking.status === "NO_SHOW") {
            throw new ValidationError(
                `Tiket berstatus ${booking.status} dan tidak dapat check-in.`
            );
        }

        if (booking.checkedInAt) {
            throw new ValidationError("Tiket ini sudah melakukan check-in sebelumnya.");
        }

        const now = new Date();
        const bookingDateStr = booking.bookingDate.toISOString().split("T")[0];
        const startH = booking.startTime
            .getUTCHours()
            .toString()
            .padStart(2, "0");
        const startM = booking.startTime
            .getUTCMinutes()
            .toString()
            .padStart(2, "0");
        const endH = booking.endTime
            .getUTCHours()
            .toString()
            .padStart(2, "0");
        const endM = booking.endTime
            .getUTCMinutes()
            .toString()
            .padStart(2, "0");

        const startDateTime = new Date(
            `${bookingDateStr}T${startH}:${startM}:00.000+07:00`
        );
        const endDateTime = new Date(
            `${bookingDateStr}T${endH}:${endM}:00.000+07:00`
        );
        const earliestCheckIn = new Date(
            startDateTime.getTime() - 15 * 60 * 1000
        );

        if (now < earliestCheckIn) {
            const openCheckInWib = new Date(
                earliestCheckIn.getTime() + 7 * 60 * 60 * 1000
            )
                .toISOString()
                .slice(11, 16);
            throw new ValidationError(
                `Check-in baru dapat dilakukan mulai 15 menit sebelum sesi dimulai (${bookingDateStr} pukul ${openCheckInWib}).`
            );
        }

        if (now > endDateTime) {
            throw new ValidationError(
                "Sesi bermain sudah berakhir, check-in tidak dapat dilakukan."
            );
        }

        return prisma.booking.update({
            where: { id: booking.id },
            data: { checkedInAt: new Date() },
            include: {
                user: { select: { id: true, fullName: true, email: true } },
                field: { include: { venue: true } },
                payment: true,
            },
        });
    }

    public async findMyFields(renterId: string) {
        return prisma.field.findMany({
            where: {
                venue: {
                    renterId,
                },
            },
            include: {
                venue: true,
                _count: {
                    select: { bookings: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }

    public async findMyFieldById(renterId: string, fieldId: string) {
        return prisma.field.findFirst({
            where: {
                id: fieldId,
                venue: {
                    renterId,
                },
            },
            include: {
                venue: true,
                _count: {
                    select: { bookings: true },
                },
            },
        });
    }

    public async countMyBookings(renterId: string) {
        return prisma.booking.count({
            where: {
                field: {
                    venue: {
                        renterId,
                    },
                },
            },
        });
    }

    public async countMyVenues(renterId: string) {
        return prisma.venue.count({
            where: { renterId },
        });
    }

    public async countMyFields(renterId: string) {
        return prisma.field.count({
            where: {
                venue: {
                    renterId,
                },
            },
        });
    }

    public async findMyVenuesWithPagination(
        renterId: string,
        query: Pagination
    ) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.VenueWhereInput = search
            ? {
                  name: {
                      contains: search,
                      mode: "insensitive",
                  },
              }
            : {};

        const [venues, total] = await prisma.$transaction([
            prisma.venue.findMany({
                where: {
                    renterId,
                    AND: whereCondition,
                },
                include: {
                    renter: {
                        select: {
                            fullName: true,
                            email: true,
                        },
                    },
                    photos: true,
                    _count: {
                        select: { fields: true },
                    },
                },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.venue.count({
                where: {
                    renterId,
                    AND: whereCondition,
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return { data: venues, meta: { total, page, limit, totalPages } };
    }

    public async findMyBookingsWithPagination(
        renterId: string,
        query: Pagination
    ) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.BookingWhereInput = {
            field: {
                venue: {
                    renterId,
                },
            },
            AND: search
                ? [
                      {
                          field: {
                              name: {
                                  contains: search,
                                  mode: "insensitive",
                              },
                          },
                      },
                  ]
                : [],
        };

        const [bookings, total] = await prisma.$transaction([
            prisma.booking.findMany({
                where: whereCondition,
                include: {
                    field: {
                        include: {
                            venue: true,
                        },
                    },
                },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.booking.count({ where: whereCondition }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return { data: bookings, meta: { total, page, limit, totalPages } };
    }

    public async findMyFieldsWithPagination(
        renterId: string,
        query: Pagination
    ) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.FieldWhereInput = {
            venue: {
                renterId,
            },
            AND: search
                ? [
                      {
                          name: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                  ]
                : [],
        };

        const [fields, total] = await prisma.$transaction([
            prisma.field.findMany({
                where: whereCondition,
                include: {
                    venue: true,
                    _count: {
                        select: { bookings: true },
                    },
                },
                skip: skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.field.count({ where: whereCondition }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return { data: fields, meta: { total, page, limit, totalPages } };
    }

    public async getRevenueStats(
        renterId: string,
        options?: {
            period?: "all" | "7d" | "30d" | "this_month" | "last_month";
            venueId?: string;
        }
    ) {
        const period = options?.period || "this_month";
        const scopedVenueId =
            options?.venueId && options.venueId !== "ALL"
                ? options.venueId
                : undefined;

        const wibOffsetMs = 7 * 60 * 60 * 1000;
        const wibNow = new Date(Date.now() + wibOffsetMs);
        const year = wibNow.getUTCFullYear();
        const month = wibNow.getUTCMonth();
        const day = wibNow.getUTCDate();

        const startOfThisMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
        const startOfLastMonth = new Date(
            Date.UTC(year, month - 1, 1, 0, 0, 0, 0)
        );
        const endOfLastMonth = new Date(
            Date.UTC(year, month, 0, 23, 59, 59, 999)
        );

        let periodDateFilter: Prisma.DateTimeFilter<"Booking"> | undefined;
        if (period === "this_month") {
            periodDateFilter = { gte: startOfThisMonth };
        } else if (period === "last_month") {
            periodDateFilter = { gte: startOfLastMonth, lte: endOfLastMonth };
        } else if (period === "7d") {
            periodDateFilter = {
                gte: new Date(Date.UTC(year, month, day - 6, 0, 0, 0, 0)),
            };
        } else if (period === "30d") {
            periodDateFilter = {
                gte: new Date(Date.UTC(year, month, day - 29, 0, 0, 0, 0)),
            };
        }

        const venueWhere: Prisma.VenueWhereInput = scopedVenueId
            ? { id: scopedVenueId, renterId }
            : { renterId };

        const periodBookingWhere: Prisma.BookingWhereInput = {
            field: { venue: venueWhere },
            ...(periodDateFilter ? { bookingDate: periodDateFilter } : {}),
        };

        const [
            totalRevenueResult,
            monthlyRevenueResult,
            lastMonthRevenueResult,
            pendingRevenueResult,
            totalOrdersCount,
            venues,
            transactions,
        ] = await Promise.all([
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                _count: { id: true },
                where: {
                    ...periodBookingWhere,
                    payment: { status: "PAID" },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    payment: { status: "PAID" },
                    bookingDate: { gte: startOfThisMonth },
                    field: { venue: venueWhere },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                where: {
                    payment: { status: "PAID" },
                    bookingDate: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                    field: { venue: venueWhere },
                },
            }),
            prisma.booking.aggregate({
                _sum: { totalPrice: true },
                _count: { id: true },
                where: {
                    ...periodBookingWhere,
                    status: { not: "CANCELLED" },
                    OR: [
                        { payment: { is: { status: "PENDING" } } },
                        { payment: { is: null } },
                    ],
                },
            }),
            prisma.booking.count({
                where: periodBookingWhere,
            }),
            prisma.venue.findMany({
                where: { renterId },
                include: {
                    fields: {
                        include: {
                            bookings: {
                                where: {
                                    payment: { status: "PAID" },
                                    ...(periodDateFilter
                                        ? { bookingDate: periodDateFilter }
                                        : {}),
                                },
                                select: { totalPrice: true },
                            },
                        },
                    },
                },
            }),
            prisma.booking.findMany({
                where: periodBookingWhere,
                orderBy: [
                    { bookingDate: "desc" },
                    { startTime: "desc" },
                    { createdAt: "desc" },
                ],
                take: 500,
                include: {
                    user: {
                        select: {
                            fullName: true,
                            email: true,
                            phoneNumber: true,
                        },
                    },
                    payment: {
                        select: { status: true },
                    },
                    field: {
                        select: {
                            id: true,
                            name: true,
                            venue: { select: { id: true, name: true } },
                        },
                    },
                },
            }),
        ]);

        const allFieldIds = venues.flatMap((v) => v.fields.map((f) => f.id));
        const reviewStats = allFieldIds.length
            ? await prisma.review.groupBy({
                  by: ["fieldId"],
                  _avg: { rating: true },
                  _count: { rating: true },
                  where: { fieldId: { in: allFieldIds } },
              })
            : [];

        const reviewMap = new Map(
            reviewStats.map((r) => [
                r.fieldId,
                {
                    avg: r._avg.rating || 0,
                    count: r._count.rating || 0,
                },
            ])
        );

        const revenueByVenue = venues
            .map((venue) => {
                const bookingCount = venue.fields.reduce(
                    (acc, field) => acc + field.bookings.length,
                    0
                );
                const venueRevenue = venue.fields.reduce((acc, field) => {
                    const fieldRevenue = field.bookings.reduce(
                        (sum, booking) => sum + booking.totalPrice,
                        0
                    );
                    return acc + fieldRevenue;
                }, 0);

                return {
                    venueId: venue.id,
                    venueName: venue.name,
                    fieldCount: venue.fields.length,
                    bookingCount,
                    totalRevenue: venueRevenue,
                };
            })
            .sort((a, b) => b.totalRevenue - a.totalRevenue);

        const revenueByField = venues
            .flatMap((venue) =>
                venue.fields.map((field) => {
                    const rev = reviewMap.get(field.id);
                    return {
                        fieldId: field.id,
                        fieldName: field.name,
                        venueId: venue.id,
                        venueName: venue.name,
                        pricePerHour: field.pricePerHour,
                        isClosed: field.isClosed,
                        bookingCount: field.bookings.length,
                        averageRating: rev ? Number(rev.avg.toFixed(1)) : 0,
                        reviewCount: rev?.count ?? 0,
                        totalRevenue: field.bookings.reduce(
                            (sum, booking) => sum + booking.totalPrice,
                            0
                        ),
                    };
                })
            )
            .sort((a, b) => b.totalRevenue - a.totalRevenue);

        const totalRevenue = totalRevenueResult._sum.totalPrice || 0;
        const totalPaidBookings = totalRevenueResult._count.id || 0;
        const monthlyRevenue = monthlyRevenueResult._sum.totalPrice || 0;
        const lastMonthRevenue = lastMonthRevenueResult._sum.totalPrice || 0;
        const revenueDeltaPct =
            lastMonthRevenue > 0
                ? Number(
                      (
                          ((monthlyRevenue - lastMonthRevenue) /
                              lastMonthRevenue) *
                          100
                      ).toFixed(1)
                  )
                : null;
        const pendingRevenue = pendingRevenueResult._sum.totalPrice || 0;
        const pendingCount = pendingRevenueResult._count.id || 0;
        const paidRatePct =
            totalOrdersCount > 0
                ? Number(((totalPaidBookings / totalOrdersCount) * 100).toFixed(1))
                : 0;

        return {
            period,
            generatedAt: new Date().toISOString(),
            totalRevenue,
            monthlyRevenue,
            lastMonthRevenue,
            revenueDeltaPct,
            pendingRevenue,
            pendingCount,
            totalPaidBookings,
            totalOrdersCount,
            paidRatePct,
            averageOrderValue:
                totalPaidBookings > 0
                    ? Math.round(totalRevenue / totalPaidBookings)
                    : 0,
            venueOptions: venues.map((v) => ({
                venueId: v.id,
                venueName: v.name,
            })),
            revenueByVenue,
            revenueByField,
            transactions,
            totalTransactionsCount: totalOrdersCount,
        };
    }
    public async getPublicRenters(query: Partial<Pagination>) {
        const pageNum = Number(query.page) || 1;
        const limitNum = Number(query.limit) || 12;
        const skip = (pageNum - 1) * limitNum;
        const search = query.search?.trim();

        const whereCondition: Prisma.UserWhereInput = {
            role: "RENTER",
            isVerified: true,
            ...(search
                ? {
                      OR: [
                          {
                              fullName: {
                                  contains: search,
                                  mode: "insensitive",
                              },
                          },
                          {
                              profile: {
                                  companyName: {
                                      contains: search,
                                      mode: "insensitive",
                                  },
                              },
                          },
                      ],
                  }
                : {}),
        };

        const [renters, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: whereCondition,
                skip,
                take: limitNum,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    fullName: true,
                    createdAt: true,
                    profile: {
                        select: {
                            profilePictureUrl: true,
                            companyName: true,
                            companyDescription: true,
                            companyLogoUrl: true,
                            companyWebsite: true,
                        },
                    },
                    _count: {
                        select: {
                            venues: {
                                where: { status: "APPROVED" },
                            },
                        },
                    },
                },
            }),
            prisma.user.count({ where: whereCondition }),
        ]);

        return {
            data: renters,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        };
    }

    public async getPublicProfile(renterId: string) {
        const renter = await prisma.user.findUnique({
            where: { id: renterId, role: "RENTER" },
            select: {
                id: true,
                fullName: true,
                profile: true,
                createdAt: true,
            },
        });

        if (!renter) {
            throw new NotFoundError("Renter not found");
        }

        const venues = await prisma.venue.findMany({
            where: {
                renterId,
                status: "APPROVED",
            },
            include: {
                photos: true,
                _count: {
                    select: { fields: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            renter,
            venues,
        };
    }
}
