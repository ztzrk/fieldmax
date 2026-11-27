"use client";

import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, CalendarCheck } from "lucide-react";

interface Booking {
    id: string;
    createdAt: string;
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
            name: string;
        };
    };
}

interface RecentBookingsProps {
    bookings: Booking[];
    viewAllHref?: string;
}

const PAYMENT_STATUS_BADGE: Record<
    string,
    { label: string; className: string }
> = {
    PAID: {
        label: "Lunas",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    PENDING: {
        label: "Menunggu",
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
    },
    FAILED: {
        label: "Gagal",
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
    },
    EXPIRED: {
        label: "Kedaluwarsa",
        className:
            "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
    },
};

export function RecentBookings({
    bookings,
    viewAllHref = "/renter/bookings",
}: RecentBookingsProps) {
    return (
        <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-primary" />
                    Pemesanan Terbaru
                </CardTitle>
                {viewAllHref && (
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 gap-1 text-xs text-primary hover:text-primary"
                    >
                        <Link href={viewAllHref}>
                            Lihat Semua
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Tempat / Lapangan</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">
                                    Pembayaran
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings && bookings.length > 0 ? (
                                bookings.map((booking) => {
                                    const paymentBadge =
                                        PAYMENT_STATUS_BADGE[
                                            booking.paymentStatus || "PENDING"
                                        ] ?? {
                                            label:
                                                booking.paymentStatus ||
                                                "Menunggu",
                                            className: "",
                                        };
                                    return (
                                        <TableRow
                                            key={booking.id}
                                            className="hover:bg-muted/40"
                                        >
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">
                                                        {booking.user.fullName}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {booking.user.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">
                                                        {
                                                            booking.field.venue
                                                                .name
                                                        }
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {booking.field.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-sm">
                                                {formatCurrency(
                                                    booking.totalPrice
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        paymentBadge.className
                                                    }
                                                >
                                                    {paymentBadge.label}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center h-24 text-muted-foreground"
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
