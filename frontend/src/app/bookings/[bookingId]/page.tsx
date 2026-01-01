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
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
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
    const { data: booking, isLoading, isError } = useGetBookingById(bookingId);
    const [snapToken, setSnapToken] = useState<string | null>(null);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (booking?.snapToken) {
            setSnapToken(booking.snapToken);
        }
    }, [booking]);

    useEffect(() => {
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
        const script = document.createElement("script");
        script.src = snapScript;
        script.setAttribute("data-client-key", clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const cancelMutation = useMutation({
        mutationFn: async () => {
            return BookingService.cancel(bookingId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
        },
    });

    const handlePayment = () => {
        if (snapToken && window.snap) {
            window.snap.pay(snapToken, {
                onSuccess: function (result: unknown) {
                    window.location.reload();
                },
                onPending: function (result: unknown) {
                    window.location.reload();
                },
                onError: function (result: unknown) {
                    window.location.reload();
                },
                onClose: function () {},
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
                <h2 className="text-xl font-semibold">Booking not found</h2>
                <Link href="/bookings">
                    <Button variant="outline">Back to Bookings</Button>
                </Link>
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
                    label: "Confirmed",
                };
            case "PENDING":
                return {
                    badge: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900",
                    icon: "text-amber-600 bg-amber-100 dark:bg-amber-900/20",
                    label: "Pending",
                };
            case "CANCELLED":
            case "FAILED":
                return {
                    badge: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
                    icon: "text-red-600 bg-red-100 dark:bg-red-900/20",
                    label: "Cancelled",
                };
            case "COMPLETED":
                return {
                    badge: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900",
                    icon: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
                    label: "Completed",
                };
            default:
                return {
                    badge: "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-800",
                    icon: "text-gray-600 bg-gray-100 dark:bg-gray-800",
                    label: status,
                };
        }
    };

    const statusStyle = getStatusStyles(
        booking.paymentStatus || booking.status
    );

    return (
        <div className="min-h-screen bg-muted/5 py-10">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header & Back Button */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <Link
                        href="/bookings"
                        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center mr-2 shadow-sm group-hover:shadow-md transition-all">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Back to Bookings
                    </Link>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="text-sm text-muted-foreground">
                            Booking ID:
                        </span>
                        <Badge
                            variant="outline"
                            className="font-mono text-xs tracking-wider"
                        >
                            #{booking.id.slice(0, 8).toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className="bg-background rounded-xl border shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div
                                className={cn(
                                    "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none",
                                    booking.status === "CONFIRMED"
                                        ? "bg-emerald-500"
                                        : booking.status === "PENDING"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                )}
                            />

                            <div className="flex items-center gap-4 z-10">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                                        statusStyle.icon
                                    )}
                                >
                                    <Ticket className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Booking Status
                                    </p>
                                    <h2 className="text-xl font-bold">
                                        {statusStyle.label}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 z-10 w-full sm:w-auto">
                                {booking.status === "PENDING" &&
                                    booking.paymentStatus !== "PAID" && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full sm:w-auto hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                                >
                                                    Cancel
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you absolutely sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be
                                                        undone. This will
                                                        permanently cancel your
                                                        booking.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Dismiss
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            cancelMutation.mutate()
                                                        }
                                                        className="bg-destructive hover:bg-destructive/90"
                                                    >
                                                        Yes, Cancel
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}

                                {booking.status === "PENDING" &&
                                    booking.paymentStatus === "PENDING" && (
                                        <Button
                                            onClick={handlePayment}
                                            disabled={isPaymentLoading}
                                            className="w-full sm:w-auto shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                                        >
                                            {isPaymentLoading ? (
                                                <FullScreenLoader />
                                            ) : (
                                                `Pay Now ${formatPrice(
                                                    booking.totalPrice
                                                )}`
                                            )}
                                        </Button>
                                    )}
                            </div>
                        </div>

                        {/* Venue & Field Info */}
                        <Card className="overflow-hidden border-border/50 shadow-sm">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Booking Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 grid gap-6 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Venue
                                    </label>
                                    <p className="font-medium text-lg">
                                        {booking.field.venue.name}
                                    </p>
                                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground mt-1">
                                        <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" />
                                        <span>
                                            {booking.field.venue.address}
                                            {booking.field.venue.city &&
                                                `, ${booking.field.venue.city}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Field
                                    </label>
                                    <p className="font-medium text-lg">
                                        {booking.field.name}
                                    </p>
                                    <Badge variant="secondary" className="mt-1">
                                        {booking.field.sportType}
                                    </Badge>
                                </div>
                            </CardContent>
                            <Separator className="bg-border/50" />
                            <CardContent className="py-6 grid gap-6 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Schedule
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">
                                            {formatDate(booking.bookingDate)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">
                                            {formatTime(booking.startTime)} -{" "}
                                            {formatTime(booking.endTime)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Payment Info
                                    </label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Wallet className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">
                                            {booking.paymentStatus === "PENDING"
                                                ? "Unpaid"
                                                : "QRIS Payment"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Receipt className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium">
                                            ID: {booking.id.slice(0, 8)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Review Section */}
                        {booking.review && (
                            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <StarRating
                                        rating={booking.review.rating}
                                        size={20}
                                    />
                                    <span className="font-medium text-yellow-700 dark:text-yellow-500">
                                        Your Review
                                    </span>
                                </div>
                                {booking.review.comment && (
                                    <p className="text-muted-foreground italic">
                                        "{booking.review.comment}"
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Summary */}
                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-sm h-fit sticky top-24">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle className="text-base text-muted-foreground">
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">
                                        Field Price
                                    </span>
                                    <span>
                                        {formatPrice(booking.totalPrice)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">
                                        Service Fee
                                    </span>
                                    <span>Rp 0</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatPrice(booking.totalPrice)}
                                    </span>
                                </div>

                                {booking.status === "CONFIRMED" && (
                                    <div className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs p-3 rounded-lg text-center mt-4 border border-green-500/20">
                                        Payment verified. Enjoy your game!
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
