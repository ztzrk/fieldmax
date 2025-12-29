
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetBookingById } from "@/hooks/useBookings";
import {  formatDate, formatPrice, formatTime } from "@/lib/utils";
import BookingService from "@/services/booking.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Calendar, Clock, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function BookingDetailPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = use(params);
    const { data: booking, isLoading, isError } = useGetBookingById(bookingId);
    const [snapToken, setSnapToken] = useState<string | null>(null);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

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
            // Optionally redirect or show a toast
        },
    });

    const handlePayment = () => {
        if (snapToken && window.snap) {
            window.snap.pay(snapToken, {
                onSuccess: function (result: any) {
                    console.log("payment success!", result);
                    window.location.reload();
                },
                onPending: function (result: any) {
                    console.log("waiting for payment!", result);
                    window.location.reload();
                },
                onError: function (result: any) {
                    console.log("payment failed!", result);
                    window.location.reload();
                },
                onClose: function () {
                    console.log("customer closed the popup without finishing the payment");
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !booking) {
        return (
            <div className="container py-10 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">Booking not found</h2>
                <Link href="/bookings">
                    <Button variant="outline">Back to Bookings</Button>
                </Link>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
            case "PAID":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "CANCELLED":
            case "FAILED":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="container py-10 max-w-2xl mx-auto px-4 sm:px-6">
            <div className="mb-6">
                <Link href="/bookings">
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
                        ← Back to Bookings
                    </Button>
                </Link>
            </div>

            <Card className="overflow-hidden">
                <CardHeader className="bg-muted/20 pb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant="outline" className="mb-2">
                                Booking #{booking.id.slice(0, 8)}...
                            </Badge>
                            <CardTitle className="text-2xl font-bold">{booking.field.name || "Field"}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                                <MapPin className="h-4 w-4" />
                                {booking.field.venue.location}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-primary">
                                {formatPrice(booking.totalPrice)}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="-mt-4 pt-6 bg-card rounded-t-xl border-t">
                    <div className="grid gap-6">
                        <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${
                                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-red-100 text-red-600'
                                }`}>
                                    {booking.status === 'CONFIRMED' ? <Calendar className="h-5 w-5" /> : 
                                     booking.status === 'PENDING' ? <Clock className="h-5 w-5" /> : 
                                     <AlertCircle className="h-5 w-5" />}
                                </div>
                                <div>
                                    <p className="font-medium">Status</p>
                                    <p className="text-sm text-muted-foreground capitalize">{booking.status.toLowerCase()}</p>
                                </div>
                            </div>
                            <Badge className={getStatusColor(booking.paymentStatus || booking.status)}>
                                {booking.paymentStatus || booking.status}
                            </Badge>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-4">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Booking Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Venue</p>
                                    <p className="font-medium">{booking.field.venue.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Field</p>
                                    <p className="font-medium">
                                        {booking.field.name}
                                        <span className="text-muted-foreground ml-1">
                                            ({booking.field.sportType})
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="font-medium">{formatDate(booking.bookingDate)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Payment Method</p>
                                    <p className="font-medium">
                                        {booking.paymentStatus === "PENDING" ? "Waiting for payment" : "QRIS"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground">Time</p>
                                    <p className="font-medium">
                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                             {/* Cancel Button for Pending Bookings */}
                             {(booking.status === "PENDING" && booking.paymentStatus !== "PAID") && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={cancelMutation.isPending}>
                                            {cancelMutation.isPending ? "Cancelling..." : "Cancel Booking"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will cancel your booking immediately. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Dismiss</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => cancelMutation.mutate()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Yes, Cancel
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            {/* Pay Button for Pending Bookings */}
                            {booking.status === "PENDING" && booking.paymentStatus === "PENDING" && (
                                <Button onClick={handlePayment} disabled={isPaymentLoading} className="w-full sm:w-auto">
                                    {isPaymentLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Pay Now " + formatPrice(booking.totalPrice)
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ShieldCheck(props: any) {
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
    )
}
