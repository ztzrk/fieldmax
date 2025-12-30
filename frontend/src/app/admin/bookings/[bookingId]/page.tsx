"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetBookingById } from "@/hooks/useBookings";
import {  formatDate, formatPrice, formatTime } from "@/lib/utils";
import { AlertCircle, Calendar, Clock, Loader2, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

/**
 * AdminBookingDetailPage Component
 * 
 * Displays detailed information about a specific booking for admins.
 * similar to the public view but without payment actions.
 */
export default function AdminBookingDetailPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = use(params);
    const { data: booking, isLoading, isError } = useGetBookingById(bookingId);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !booking) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">Booking not found</h2>
                <Link href="/admin/bookings">
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
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/bookings">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Booking Details</h2>
                    <p className="text-muted-foreground">
                        View details for booking #{booking.id.slice(0, 8)}
                    </p>
                </div>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Booking Details
                                </h3>
                                <div className="space-y-4 text-sm">
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
                                        <p className="text-muted-foreground">Time</p>
                                        <p className="font-medium">
                                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Payment Method</p>
                                        <p className="font-medium">
                                            {booking.paymentStatus === "PENDING" ? "Waiting for payment" : "QRIS"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                    User Information
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Full Name</p>
                                        <p className="font-medium">{booking.user?.fullName || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-medium">{booking.user?.email || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">User ID</p>
                                        <p className="font-medium text-xs font-mono">{booking.userId}</p>
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

function UserIcon(props: any) {
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
    )
}
