"use client";

import Link from "next/link";
import { Clock, MapPin, ArrowRight, Ticket, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { formatTime, cn } from "@/lib/utils";
import { StarRating } from "@/components/reviews/StarRating";

interface BookingCardProps {
    booking: BookingResponseSchema;
    onReview?: (bookingId: string) => void;
    isPast?: boolean;
}

const STATUS_CONFIG: Record<
    string,
    { label: string; badgeClass: string; dotClass: string; stubAccent: string }
> = {
    PAID: {
        label: "Lunas",
        badgeClass:
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
        dotClass: "bg-emerald-500",
        stubAccent: "from-emerald-500/10 via-primary/5 to-transparent",
    },
    CONFIRMED: {
        label: "Dikonfirmasi",
        badgeClass:
            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
        dotClass: "bg-emerald-500",
        stubAccent: "from-emerald-500/10 via-primary/5 to-transparent",
    },
    PENDING: {
        label: "Menunggu Pembayaran",
        badgeClass:
            "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
        dotClass: "bg-amber-500 animate-pulse",
        stubAccent: "from-amber-500/10 via-amber-500/5 to-transparent",
    },
    COMPLETED: {
        label: "Selesai",
        badgeClass:
            "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
        dotClass: "bg-blue-500",
        stubAccent: "from-blue-500/10 via-muted/40 to-transparent",
    },
    CANCELLED: {
        label: "Dibatalkan",
        badgeClass:
            "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
        dotClass: "bg-red-500",
        stubAccent: "from-red-500/10 via-muted/30 to-transparent",
    },
    FAILED: {
        label: "Gagal",
        badgeClass:
            "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
        dotClass: "bg-red-500",
        stubAccent: "from-red-500/10 via-muted/30 to-transparent",
    },
    EXPIRED: {
        label: "Kedaluwarsa",
        badgeClass:
            "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400",
        dotClass: "bg-zinc-400",
        stubAccent: "from-muted/50 to-transparent",
    },
};

export function BookingCard({ booking, onReview, isPast }: BookingCardProps) {
    const canReview =
        (booking.status === "COMPLETED" || booking.status === "CONFIRMED") &&
        !booking.review &&
        isPast;

    const statusKey =
        booking.status === "CANCELLED" || booking.status === "COMPLETED"
            ? booking.status
            : booking.paymentStatus || booking.status;

    const statusInfo = STATUS_CONFIG[statusKey] || {
        label: statusKey,
        badgeClass: "bg-muted text-muted-foreground border-border",
        dotClass: "bg-muted-foreground",
        stubAccent: "from-muted/40 to-transparent",
    };

    const bookingDateObj = new Date(booking.bookingDate);
    const weekday = bookingDateObj.toLocaleDateString("id-ID", {
        weekday: "short",
    });
    const dayNum = bookingDateObj.getDate();
    const monthYear = bookingDateObj.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
    });

    return (
        <Card className="group relative overflow-hidden py-0 border-border/60 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 rounded-2xl">
            <div className="flex flex-col sm:flex-row">
                {/* Left Ticket Stub: Date & Time */}
                <div
                    className={cn(
                        "relative sm:w-40 shrink-0 bg-gradient-to-br p-5 flex sm:flex-col items-center justify-between sm:justify-center text-center border-b sm:border-b-0 sm:border-r border-dashed border-border/80",
                        statusInfo.stubAccent
                    )}
                >
                    {/* Ticket Perforation Notches */}
                    <div className="hidden sm:block absolute -right-3 -top-3 h-6 w-6 rounded-full bg-background border-b border-border/60" />
                    <div className="hidden sm:block absolute -right-3 -bottom-3 h-6 w-6 rounded-full bg-background border-t border-border/60" />

                    <div className="flex sm:flex-col items-baseline sm:items-center gap-2 sm:gap-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                            {weekday}
                        </span>
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-none my-0.5">
                            {dayNum}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground uppercase">
                            {monthYear}
                        </span>
                    </div>

                    <div className="sm:mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 border border-border/60 text-xs font-semibold text-foreground shadow-xs">
                        <Clock className="h-3 w-3 text-primary" />
                        <span>
                            {formatTime(booking.startTime)} –{" "}
                            {formatTime(booking.endTime)}
                        </span>
                    </div>
                </div>

                {/* Right Ticket Body */}
                <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                <Ticket className="h-3.5 w-3.5 text-primary/70" />
                                <span>
                                    #{booking.id.slice(0, 8).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg sm:text-xl tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                                {booking.field?.venue?.name ||
                                    "Tempat Olahraga"}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                                <span className="line-clamp-1">
                                    {booking.field?.venue?.city ||
                                        booking.field?.venue?.address ||
                                        "Lokasi tersedia di detail"}
                                </span>
                            </p>
                        </div>

                        <Badge
                            variant="outline"
                            className={cn(
                                "w-fit font-medium border shadow-none px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shrink-0",
                                statusInfo.badgeClass
                            )}
                        >
                            <span
                                className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    statusInfo.dotClass
                                )}
                            />
                            {statusInfo.label}
                        </Badge>
                    </div>

                    {/* Ticket Metadata Strip */}
                    <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/30 border border-border/50 px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Trophy className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <span className="block text-[11px] uppercase tracking-wider text-muted-foreground">
                                    Lapangan
                                </span>
                                <span className="block text-sm font-semibold truncate">
                                    {booking.field?.name || "-"}
                                </span>
                            </div>
                        </div>

                        <div className="text-right flex flex-col justify-center">
                            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                Total Pembayaran
                            </span>
                            <span className="font-bold text-base sm:text-lg text-primary">
                                Rp {booking.totalPrice.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                        {canReview && onReview && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 text-xs rounded-xl"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onReview(booking.id);
                                }}
                            >
                                Tulis Ulasan
                            </Button>
                        )}
                        {booking.review && (
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                                <StarRating
                                    rating={booking.review.rating}
                                    size={12}
                                />
                                <span className="text-[10px] font-semibold text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">
                                    Sudah Diulas
                                </span>
                            </div>
                        )}

                        <Link
                            href={`/bookings/${booking.id}`}
                            className="flex-1 sm:flex-none"
                        >
                            <Button
                                className="w-full sm:w-auto h-9 text-xs rounded-xl group/btn"
                                size="sm"
                            >
                                Lihat Tiket
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
}
