"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetBookingById } from "@/hooks/useBookings";
import { formatDate, formatPrice, formatTime, cn } from "@/lib/utils";
import BookingService from "@/services/booking.service";
import { StarRating } from "@/components/reviews/StarRating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    Calendar,
    Clock,
    MapPin,
    Ticket,
    ShieldCheck,
    ArrowRight,
    Wallet,
    Receipt,
    ArrowLeft,
    RefreshCw,
    QrCode,
    CheckCircle2,
    HelpCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FullScreenLoader } from "@/components/FullScreenLoader";

/**
 * BookingDetailPage Component
 *
 * Displays detailed information about a specific booking, including status,
 * venue details, and payment options. Handles cancellation and payment flows.
 */
export default function BookingDetailPage({
    params,
}: {
    params: Promise<{ bookingId: string }>;
}) {
    const { bookingId } = use(params);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const {
        data: booking,
        isLoading,
        isError,
        refetch,
    } = useGetBookingById(bookingId, {
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === "PENDING" ? 2500 : false;
        },
    });
    const snapToken = booking?.payment?.snapToken || booking?.snapToken || null;
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
        let script = document.querySelector(`script[src="${snapScript}"]`) as HTMLScriptElement;

        if (!script) {
            script = document.createElement("script");
            script.src = snapScript;
            script.setAttribute("data-client-key", clientKey);
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const cancelMutation = useMutation({
        mutationFn: async () => {
            return BookingService.cancel(bookingId);
        },
        onSuccess: () => {
            toast.success("Pemesanan berhasil dibatalkan.");
            queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
        },
    });

    const handleCheckPaymentStatus = async () => {
        setIsRefreshing(true);
        try {
            const result = await refetch();
            if (
                result.data?.status === "CONFIRMED" ||
                result.data?.payment?.status === "PAID"
            ) {
                toast.success("Pembayaran terkonfirmasi!", {
                    description: "Pemesanan Anda telah berstatus CONFIRMED.",
                });
            } else {
                toast.info("Status pembayaran masih PENDING", {
                    description:
                        "Jika baru saja menyelesaikan transaksi, mohon tunggu sesaat dan periksa kembali.",
                });
            }
        } catch {
            toast.error("Gagal memeriksa status pembayaran.");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handlePayment = () => {
        if (snapToken && window.snap) {
            window.snap.pay(snapToken, {
                onSuccess: function () {
                    toast.success("Pembayaran berhasil!");
                    refetch();
                },
                onPending: function () {
                    toast.info("Menunggu penyelesaian pembayaran...");
                    refetch();
                },
                onError: function () {
                    toast.error("Pembayaran gagal atau dibatalkan.");
                    refetch();
                },
                onClose: function () {
                    refetch();
                },
            });
        }
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isError || !booking) {
        return (
            <div className="container py-20 flex flex-col items-center justify-center gap-4 min-h-[50vh]">
                <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold">
                    Pemesanan tidak ditemukan
                </h2>
                <Button variant="outline" asChild>
                    <Link href="/bookings">Kembali ke Pemesanan</Link>
                </Button>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "CONFIRMED":
            case "PAID":
                return {
                    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900",
                    icon: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20",
                    glow: "bg-emerald-500",
                    label: "Dikonfirmasi",
                };
            case "PENDING":
                return {
                    badge: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900",
                    icon: "text-amber-600 bg-amber-100 dark:bg-amber-900/20",
                    glow: "bg-amber-500",
                    label: "Menunggu Pembayaran",
                };
            case "CANCELLED":
            case "FAILED":
                return {
                    badge: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
                    icon: "text-red-600 bg-red-100 dark:bg-red-900/20",
                    glow: "bg-red-500",
                    label: status === "FAILED" ? "Gagal" : "Dibatalkan",
                };
            case "EXPIRED":
                return {
                    badge: "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-800",
                    icon: "text-zinc-600 bg-zinc-100 dark:bg-zinc-800",
                    glow: "bg-zinc-500",
                    label: "Kedaluwarsa",
                };
            case "COMPLETED":
                return {
                    badge: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
                    icon: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
                    glow: "bg-blue-500",
                    label: "Selesai",
                };
            case "NO_SHOW":
                return {
                    badge: "bg-zinc-500/10 text-zinc-600 border-zinc-200 dark:border-zinc-800",
                    icon: "text-zinc-600 bg-zinc-100 dark:bg-zinc-800",
                    glow: "bg-zinc-500",
                    label: "Tidak Hadir",
                };
            default:
                return {
                    badge: "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-800",
                    icon: "text-gray-600 bg-gray-100 dark:bg-gray-800",
                    glow: "bg-gray-500",
                    label: status,
                };
        }
    };

    const statusKey =
        booking.status === "CANCELLED" ||
        booking.status === "COMPLETED" ||
        booking.status === "NO_SHOW"
            ? booking.status
            : booking.payment?.status || booking.paymentStatus || booking.status;

    const statusStyle = getStatusStyles(statusKey);

    return (
        <div className="min-h-screen bg-background py-8 sm:py-10">
            <div className="container max-w-5xl mx-auto px-4 sm:px-6">
                {/* Header & Back Button */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        href="/bookings"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-muted/50 border flex items-center justify-center mr-2.5 group-hover:bg-muted transition-all">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Kembali ke Pemesanan
                    </Link>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            Kode Tiket
                        </span>
                        <Badge
                            variant="outline"
                            className="font-mono text-xs tracking-wider px-3 py-1 rounded-full bg-muted/40"
                        >
                            #{booking.id.slice(0, 8).toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
                            <div
                                className={cn(
                                    "absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none",
                                    statusStyle.glow
                                )}
                            />

                            <div className="flex items-center gap-4 z-10">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                        statusStyle.icon
                                    )}
                                >
                                    <Ticket className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Status Pemesanan
                                    </p>
                                    <h2 className="text-xl font-bold mt-0.5">
                                        {statusStyle.label}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 z-10 w-full sm:w-auto">
                                {booking.status === "PENDING" &&
                                    booking.payment?.status !== "PAID" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 sm:flex-none rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 transition-colors"
                                                >
                                                    Batalkan
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Apakah Anda yakin ingin
                                                        membatalkan?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini tidak dapat
                                                        dibatalkan. Pemesanan
                                                        Anda akan dibatalkan
                                                        secara permanen.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Tutup
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            cancelMutation.mutate()
                                                        }
                                                        className="bg-destructive hover:bg-destructive/90"
                                                    >
                                                        Ya, Batalkan
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}

                                {booking.status === "PENDING" &&
                                    booking.payment?.status === "PENDING" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={
                                                    handleCheckPaymentStatus
                                                }
                                                disabled={isRefreshing}
                                                className="flex-1 sm:flex-none rounded-xl inline-flex items-center gap-2"
                                            >
                                                <RefreshCw
                                                    className={cn(
                                                        "h-4 w-4",
                                                        isRefreshing &&
                                                            "animate-spin text-primary"
                                                    )}
                                                />
                                                <span>
                                                    {isRefreshing
                                                        ? "Memeriksa..."
                                                        : "Cek Status"}
                                                </span>
                                            </Button>
                                            <Button
                                                onClick={handlePayment}
                                                disabled={isPaymentLoading}
                                                className="w-full sm:w-auto rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all"
                                            >
                                                {isPaymentLoading ? (
                                                    <FullScreenLoader />
                                                ) : (
                                                    `Bayar Sekarang`
                                                )}
                                            </Button>
                                        </>
                                    )}
                            </div>
                        </div>

                        {/* Ticket Pass Details Card */}
                        <Card className="overflow-hidden border-border/60 shadow-sm rounded-2xl py-0">
                            <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Detail Tiket &amp; Jadwal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Tempat Olahraga
                                    </label>
                                    <p className="font-bold text-lg">
                                        {booking.field.venue.name}
                                    </p>
                                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" />
                                        <span>
                                            {booking.field.venue.address}
                                            {booking.field.venue.city &&
                                                `, ${booking.field.venue.city}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Lapangan
                                    </label>
                                    <p className="font-bold text-lg">
                                        {booking.field.name}
                                    </p>
                                    {booking.field.sportType && (
                                        <Badge
                                            variant="secondary"
                                            className="mt-1 rounded-full"
                                        >
                                            {typeof booking.field.sportType ===
                                            "string"
                                                ? booking.field.sportType
                                                : booking.field.sportType?.name}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>

                            {/* Perforated Ticket Divider */}
                            <div className="relative flex items-center">
                                <div className="h-6 w-3 rounded-r-full bg-background border-y border-r border-border/60" />
                                <div className="flex-1 border-t border-dashed border-border/80" />
                                <div className="h-6 w-3 rounded-l-full bg-background border-y border-l border-border/60" />
                            </div>

                            <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Jadwal Bermain
                                    </label>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold">
                                            {formatDate(booking.bookingDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold">
                                            {formatTime(booking.startTime)} –{" "}
                                            {formatTime(booking.endTime)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Informasi Pembayaran
                                    </label>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                                            <Wallet className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium">
                                            {(booking.payment?.status ||
                                                booking.paymentStatus) ===
                                            "PENDING"
                                                ? "Menunggu Pembayaran"
                                                : "Midtrans Digital Payment"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                                            <Receipt className="h-4 w-4" />
                                        </div>
                                        <span className="font-mono text-xs text-muted-foreground">
                                            ID: {booking.id}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Section */}
                        {booking.review && (
                            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <StarRating
                                        rating={booking.review.rating}
                                        size={20}
                                    />
                                    <span className="font-semibold text-yellow-700 dark:text-yellow-500">
                                        Ulasan Anda
                                    </span>
                                </div>
                                {booking.review.comment && (
                                    <p className="text-muted-foreground italic">
                                        &ldquo;{booking.review.comment}&rdquo;
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Summary & QR Ticket */}
                    <div className="space-y-6">
                        {(booking.status === "CONFIRMED" ||
                            booking.status === "COMPLETED") && (
                            <Card className="border-border/60 shadow-sm rounded-2xl py-0 overflow-hidden">
                                <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <QrCode className="h-4 w-4 text-primary" />
                                        QR Tiket Masuk
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl border shadow-xs">
                                        <QRCodeSVG
                                            value={`FIELDMAX:${booking.id}`}
                                            size={168}
                                            level="M"
                                        />
                                    </div>
                                    {booking.checkedInAt ? (
                                        <div className="w-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs p-3 rounded-xl border border-emerald-500/20 font-medium flex items-center justify-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                                            <span>
                                                Sudah Check-In pada{" "}
                                                {new Date(
                                                    booking.checkedInAt
                                                ).toLocaleTimeString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Tunjukkan QR Code ini kepada petugas
                                            tempat olahraga saat tiba di lokasi
                                            untuk verifikasi kehadiran.
                                        </p>
                                    )}

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full rounded-xl gap-2 text-xs"
                                            >
                                                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                                                Cara Check-In &amp; Aturan
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <QrCode className="h-5 w-5 text-primary" />
                                                    Panduan &amp; Aturan
                                                    Check-In
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Ikuti langkah berikut saat
                                                    tiba di lokasi tempat
                                                    olahraga.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-5 text-sm">
                                                <div className="space-y-2.5">
                                                    <h4 className="font-semibold text-foreground">
                                                        Cara Melakukan Check-In
                                                    </h4>
                                                    <ol className="list-decimal pl-5 space-y-1.5 text-muted-foreground">
                                                        <li>
                                                            Datang ke tempat
                                                            olahraga sesuai
                                                            tanggal dan jam
                                                            bermain pada tiket.
                                                        </li>
                                                        <li>
                                                            Buka halaman detail
                                                            tiket ini dan
                                                            tunjukkan{" "}
                                                            <strong className="text-foreground">
                                                                QR Tiket Masuk
                                                            </strong>{" "}
                                                            (atau sebutkan Kode
                                                            Tiket{" "}
                                                            <span className="font-mono">
                                                                #
                                                                {booking.id
                                                                    .slice(0, 8)
                                                                    .toUpperCase()}
                                                            </span>
                                                            ) kepada petugas.
                                                        </li>
                                                        <li>
                                                            Petugas akan
                                                            memindai QR Code
                                                            Anda dan status
                                                            tiket otomatis
                                                            berubah menjadi{" "}
                                                            <strong className="text-foreground">
                                                                Sudah Check-In
                                                            </strong>
                                                            .
                                                        </li>
                                                    </ol>
                                                </div>

                                                <Separator />

                                                <div className="space-y-2.5">
                                                    <h4 className="font-semibold text-foreground">
                                                        Aturan Check-In
                                                    </h4>
                                                    <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                                                        <li>
                                                            <strong className="text-foreground">
                                                                Waktu Check-In:
                                                            </strong>{" "}
                                                            Dibuka mulai{" "}
                                                            <strong className="text-foreground">
                                                                15 menit sebelum
                                                                sesi dimulai
                                                            </strong>{" "}
                                                            hingga sesi bermain
                                                            berakhir.
                                                        </li>
                                                        <li>
                                                            <strong className="text-foreground">
                                                                1x Penggunaan:
                                                            </strong>{" "}
                                                            Setiap tiket hanya
                                                            berlaku untuk satu
                                                            kali check-in.
                                                        </li>
                                                        <li>
                                                            <strong className="text-foreground">
                                                                Ketidakhadiran
                                                                (No-Show):
                                                            </strong>{" "}
                                                            Jika tidak melakukan
                                                            check-in sampai sesi
                                                            berakhir, status
                                                            otomatis menjadi{" "}
                                                            <strong className="text-foreground">
                                                                Tidak Hadir
                                                            </strong>
                                                            , pembayaran tidak
                                                            dapat dikembalikan,
                                                            dan Anda tidak dapat
                                                            memberikan ulasan.
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="border-border/60 shadow-sm rounded-2xl h-fit py-0 overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-semibold">
                                    Ringkasan Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">
                                        Harga Sewa Lapangan
                                    </span>
                                    <span className="font-medium tabular-nums">
                                        {formatPrice(booking.totalPrice)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">
                                        Biaya Layanan
                                    </span>
                                    <span className="font-medium text-status-success">
                                        Gratis
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-primary tabular-nums">
                                        {formatPrice(booking.totalPrice)}
                                    </span>
                                </div>

                                {booking.status === "CONFIRMED" && (
                                    <div className="bg-status-success/10 text-status-success text-xs p-3.5 rounded-xl text-center border border-status-success/25 font-medium">
                                        Pembayaran terverifikasi. Tunjukkan
                                        tiket ini saat tiba di lokasi!
                                    </div>
                                )}
                                {booking.status === "PENDING" &&
                                    booking.payment?.status === "PENDING" && (
                                        <Button
                                            onClick={handlePayment}
                                            disabled={isPaymentLoading}
                                            className="w-full h-11 rounded-xl shadow-md shadow-primary/20"
                                        >
                                            Bayar Sekarang{" "}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
