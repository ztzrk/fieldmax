"use client";

import { useGetBookings } from "@/hooks/useBookings";
import { formatDate, formatTime } from "@/lib/utils";
import { Loader2, Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingHistoryPage() {
    const { data: bookingsData, isLoading, isError } = useGetBookings(1, 100); // Fetch up to 100 bookings

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container py-10 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">Failed to load bookings</h2>
                <p className="text-muted-foreground">Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const bookings = bookingsData?.data || [];
    const now = new Date();

    const activeBookings = bookings.filter((booking: any) => {
        const endTime = new Date(booking.endTime);
        const isFuture = endTime > now;
        const isPending = booking.status === "PENDING" || booking.paymentStatus === "PENDING";
        // Show as active if it's in the future OR it's pending payment (regardless of time, usually)
        return isFuture || isPending;
    });

    const historyBookings = bookings.filter((booking: any) => {
        const endTime = new Date(booking.endTime);
        const isPast = endTime <= now;
        const isNotPending = booking.status !== "PENDING" && booking.paymentStatus !== "PENDING";
        // Show in history if it's past AND not pending
        return isPast && isNotPending;
    });

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

    const BookingList = ({ list }: { list: any[] }) => {
        if (list.length === 0) {
            return (
                <Card className="text-center py-10">
                    <CardContent className="flex flex-col items-center gap-4">
                        <Calendar className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-lg font-medium text-muted-foreground">No bookings found</p>
                        <Link href="/">
                            <Button>Book a Field</Button>
                        </Link>
                    </CardContent>
                </Card>
            );
        }
        return (
            <div className="space-y-4">
                {list.map((booking: any) => (
                    <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3 bg-muted/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {booking.field?.venue?.name || "Unknown Venue"}
                                        <span className="text-muted-foreground text-sm font-normal">
                                            - {booking.field?.name || "Field"}
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {booking.field?.venue?.location || "Location not available"}
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className={getStatusColor(booking.paymentStatus || booking.status)}>
                                    {booking.paymentStatus || booking.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    {formatDate(booking.bookingDate)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 sm:justify-end">
                                <span className="text-sm font-bold text-primary">
                                    Rp {booking.totalPrice.toLocaleString('id-ID')}
                                </span>
                            </div>
                            {/* Add Link to Details Page */}
                            <div className="sm:col-span-3 flex justify-end mt-2">
                                <Link href={`/bookings/${booking.id}`}>
                                    <Button variant="outline" size="sm">View Details</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    };

    return (
        <div className="container py-10 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-4 mb-8">
                {/* Updated back link to Home instead of Profile since it's a top-level route now */}
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                    <p className="text-muted-foreground">View your past and upcoming bookings.</p>
                </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="active">Active Tickets</TabsTrigger>
                    <TabsTrigger value="history">Order History</TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                    <BookingList list={activeBookings} />
                </TabsContent>
                <TabsContent value="history">
                    <BookingList list={historyBookings} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
