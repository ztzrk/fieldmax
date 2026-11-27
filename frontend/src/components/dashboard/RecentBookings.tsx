"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import {
    BOOKING_STATUS_META,
    PAYMENT_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export interface RecentBookingItem {
    id: string;
    createdAt: string;
    bookingDate?: string;
    startTime?: string;
    endTime?: string;
    totalPrice: number;
    status: string;
    paymentStatus?: string;
    user: {
        fullName: string;
        email: string;
    };
    field: {
        name: string;
        venue: {
            id?: string;
            name: string;
        };
    };
}

interface RecentBookingsProps {
    bookings: RecentBookingItem[];
    viewAllHref?: string;
    getDetailHref?: (booking: RecentBookingItem) => string;
}

/**
 * Displays latest booking transactions with play schedule, status, and payment badges.
 */
export function RecentBookings({
    bookings,
    viewAllHref = "/renter/bookings",
    getDetailHref,
}: RecentBookingsProps) {
    return (
        <Card className="rounded-xl border border-border/70 bg-card h-full flex flex-col">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 border-b border-border/50">
                <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                        Pemesanan Terbaru
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Transaksi penyewaan yang baru masuk ke sistem
                    </p>
                </div>
                {viewAllHref && (
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 gap-1 text-xs text-primary hover:text-primary"
                    >
                        <Link href={viewAllHref}>
                            Lihat Semua
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                    </Button>
                )}
            </CardHeader>

            <CardContent className="pt-3 flex-1">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Tempat & Jadwal</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings && bookings.length > 0 ? (
                                bookings.map((booking) => {
                                    const paymentMeta = PAYMENT_STATUS_META[
                                        booking.paymentStatus || "PENDING"
                                    ] ?? {
                                        label: booking.paymentStatus || "Menunggu",
                                        tone: "warning" as const,
                                    };
                                    const bookingMeta =
                                        BOOKING_STATUS_META[booking.status];
                                    const detailHref = getDetailHref
                                        ? getDetailHref(booking)
                                        : undefined;

                                    return (
                                        <TableRow
                                            key={booking.id}
                                            className="hover:bg-muted/40"
                                        >
                                            <TableCell>
                                                <div className="flex flex-col min-w-0 max-w-[120px] xl:max-w-[150px]">
                                                    {detailHref ? (
                                                        <Link
                                                            href={detailHref}
                                                            className="font-medium text-sm text-foreground hover:text-primary hover:underline truncate"
                                                        >
                                                            {booking.user.fullName}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-medium text-sm truncate">
                                                            {booking.user.fullName}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {booking.user.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col min-w-0 max-w-[140px] xl:max-w-[200px]">
                                                    <span className="font-medium text-sm truncate">
                                                        {booking.field.venue.name} •{" "}
                                                        {booking.field.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground tabular-nums">
                                                        {booking.bookingDate
                                                            ? `${formatDate(booking.bookingDate)}${
                                                                  booking.startTime
                                                                      ? ` (${formatTime(booking.startTime)}–${formatTime(booking.endTime || "")})`
                                                                      : ""
                                                              }`
                                                            : formatDate(booking.createdAt)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-sm tabular-nums whitespace-nowrap">
                                                {formatCurrency(booking.totalPrice)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <StatusBadge
                                                        label={paymentMeta.label}
                                                        tone={paymentMeta.tone}
                                                        dot
                                                    />
                                                    {bookingMeta && (
                                                        <span className="text-[11px] text-muted-foreground">
                                                            Pesanan:{" "}
                                                            {bookingMeta.label}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center h-28 text-sm text-muted-foreground"
                                    >
                                        Belum ada pemesanan terbaru.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
