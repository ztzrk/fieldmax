"use client";

import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetBookingById } from "@/hooks/useBookings";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";
import { AlertCircle, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import {
    BOOKING_STATUS_META,
    PAYMENT_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";

/**
 * AdminBookingDetailPage Component
 *
 * Displays detailed information about a specific booking for admins.
 * similar to the public view but without payment actions.
 */
export default function AdminBookingDetailPage({
    params,
}: {
    params: Promise<{ bookingId: string }>;
}) {
    const { bookingId } = use(params);
    const { data: booking, isLoading, isError } = useGetBookingById(bookingId);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isError || !booking) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">
                    Pemesanan tidak ditemukan
                </h2>
                <Button variant="outline" asChild>
                    <Link href="/admin/bookings">Kembali ke Pemesanan</Link>
                </Button>
            </div>
        );
    }

    const bookingStatusMeta = BOOKING_STATUS_META[booking.status] ?? {
        label: booking.status,
        tone: "neutral" as const,
    };
    const resolvedPaymentStatus =
        booking.payment?.status ?? booking.paymentStatus;
    const paymentStatusMeta = resolvedPaymentStatus
        ? PAYMENT_STATUS_META[resolvedPaymentStatus] ?? {
              label: resolvedPaymentStatus,
              tone: "neutral" as const,
          }
        : bookingStatusMeta;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    aria-label="Kembali ke daftar pemesanan"
                >
                    <Link href="/admin/bookings">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Detail Pemesanan
                    </h2>
                    <p className="text-muted-foreground">
                        Informasi lengkap untuk pemesanan #{booking.id.slice(0, 8)}
                    </p>
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/20 pb-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                            <Badge variant="outline" className="mb-2 font-mono">
                                Pemesanan #{booking.id.slice(0, 8)}
                            </Badge>
                            <CardTitle className="text-2xl font-bold">
                                {booking.field.name || "Lapangan"}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <MapPin className="h-4 w-4 shrink-0" />
                                {booking.field.venue.location ||
                                    booking.field.venue.address}
                            </CardDescription>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-sm text-muted-foreground mb-1">
                                Total Pembayaran
                            </p>
                            <p className="text-2xl font-bold text-primary tabular-nums">
                                {formatPrice(booking.totalPrice)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="-mt-4 pt-6 bg-card rounded-t-xl border-t">
                    <div className="grid gap-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted/10 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-full ${
                                        booking.status === "CONFIRMED"
                                            ? "bg-status-success/10 text-status-success"
                                            : booking.status === "PENDING"
                                            ? "bg-status-warning/10 text-status-warning"
                                            : "bg-destructive/10 text-destructive"
                                    }`}
                                >
                                    {booking.status === "CONFIRMED" ? (
                                        <Calendar className="h-5 w-5" />
                                    ) : booking.status === "PENDING" ? (
                                        <Clock className="h-5 w-5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">Status</p>
                                    <p className="text-sm text-muted-foreground">
                                        {bookingStatusMeta.label}
                                    </p>
                                </div>
                            </div>
                            <StatusBadge
                                label={paymentStatusMeta.label}
                                tone={paymentStatusMeta.tone}
                            />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Detail Pemesanan
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            Tempat Olahraga
                                        </p>
                                        <p className="font-medium">
                                            {booking.field.venue.name}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            Lapangan
                                        </p>
                                        <p className="font-medium">
                                            {booking.field.name}
                                            <span className="text-muted-foreground ml-1">
                                                ({booking.field.sportType})
                                            </span>
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            Tanggal
                                        </p>
                                        <p className="font-medium">
                                            {formatDate(booking.bookingDate)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            Waktu
                                        </p>
                                        <p className="font-medium tabular-nums">
                                            {formatTime(booking.startTime)} –{" "}
                                            {formatTime(booking.endTime)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            Metode Pembayaran
                                        </p>
                                        <p className="font-medium">
                                            {resolvedPaymentStatus === "PENDING"
                                                ? "Menunggu pembayaran"
                                                : booking.payment
                                                      ?.paymentMethod ||
                                                  "Midtrans Digital Payment"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                    Informasi Pengguna
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            Nama Lengkap
                                        </p>
                                        <p className="font-medium">
                                            {booking.user?.fullName || "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            Email
                                        </p>
                                        <p className="font-medium">
                                            {booking.user?.email || "-"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">
                                            ID Pengguna
                                        </p>
                                        <p className="font-medium text-xs font-mono break-all">
                                            {booking.userId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ShieldCheck(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
