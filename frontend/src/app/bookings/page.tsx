"use client";

import { useGetBookings } from "@/hooks/useBookings";
import { formatDate, formatTime } from "@/lib/utils";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { useState } from "react";

/**
 * BookingHistoryPage Component
 *
 * Displays a list of user bookings, separated into active tickets and order history.
 * Provides booking status, details, and navigation.
 */
export default function BookingHistoryPage() {
    const { data: bookingsData, isLoading, isError } = useGetBookings(1, 100);

    const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isError) {
        return (
            <div className="container py-10 flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">
                    Failed to load bookings
                </h2>
                <p className="text-muted-foreground">Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const bookings = bookingsData?.data || [];
    const now = new Date();

    const activeBookings = bookings.filter((booking: BookingResponseSchema) => {
        const datePart = booking.bookingDate.toString().split("T")[0];
        let timePart = booking.endTime;
        if (booking.endTime.toString().includes("T")) {
            timePart = booking.endTime.toString().split("T")[1];
        }
        const dateTimeString = `${datePart}T${timePart}`;
        const endDateTime = new Date(dateTimeString);

        const isFuture = endDateTime > now;
        const isPending =
            booking.status === "PENDING" || booking.paymentStatus === "PENDING";
        return isFuture || isPending;
    });

    const historyBookings = bookings.filter(
        (booking: BookingResponseSchema) => {
            const datePart = booking.bookingDate.toString().split("T")[0];
            let timePart = booking.endTime;
            if (booking.endTime.toString().includes("T")) {
                timePart = booking.endTime.toString().split("T")[1];
            }
            const dateTimeString = `${datePart}T${timePart}`;
            const endDateTime = new Date(dateTimeString);

            const isPast = endDateTime <= now;
            const isNotPending =
                booking.status !== "PENDING" &&
                booking.paymentStatus !== "PENDING";
            return isPast && isNotPending;
        }
    );

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

    const BookingList = ({ list }: { list: BookingResponseSchema[] }) => {
        if (list.length === 0) {
            return (
                <Card className="text-center py-10">
                    <CardContent className="flex flex-col items-center gap-4">
                        <Calendar className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-lg font-medium text-muted-foreground">
                            No bookings found
                        </p>
                        <Link href="/">
                            <Button>Book a Field</Button>
                        </Link>
                    </CardContent>
                </Card>
            );
        }
        return (
            <div className="space-y-4">
                {list.map((booking: BookingResponseSchema) => {
                    // Logic to check if reviewable:
                    // 1. Status is COMPLETED (or similar logic handled by backend, but UI hint is good)
                    // 2. No review exists (we need to know if review exists. Let's assume booking object has 'review' prop)
                    // Since 'review' might not be in the type yet, we need to update schema type on frontend first or assume it's there.
                    // The backend `Booking` model has `review Review?`.
                    // The frontend BookingResponseSchema needs to be updated to include 'review'.

                    const canReview =
                        (booking.status === "COMPLETED" ||
                            booking.status === "CONFIRMED") &&
                        !booking.review;

                    return (
                        <Card
                            key={booking.id}
                            className="overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <CardHeader className="pb-3 bg-muted/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {booking.field?.venue?.name ||
                                                "Unknown Venue"}
                                            <span className="text-muted-foreground text-sm font-normal">
                                                -{" "}
                                                {booking.field?.name || "Field"}
                                            </span>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {booking.field?.venue?.address ||
                                                "Address not available"}
                                            {booking.field?.venue?.district &&
                                                `, ${booking.field?.venue?.district}`}
                                            {booking.field?.venue?.city &&
                                                `, ${booking.field?.venue?.city}`}
                                            {booking.field?.venue?.province &&
                                                `, ${booking.field?.venue?.province}`}
                                            {booking.field?.venue?.postalCode &&
                                                ` ${booking.field?.venue?.postalCode}`}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={getStatusColor(
                                            booking.paymentStatus ||
                                                booking.status
                                        )}
                                    >
                                        {booking.paymentStatus ||
                                            booking.status}
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
                                        {formatTime(booking.startTime)} -{" "}
                                        {formatTime(booking.endTime)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 sm:justify-end">
                                    <span className="text-sm font-bold text-primary">
                                        Rp{" "}
                                        {booking.totalPrice.toLocaleString(
                                            "id-ID"
                                        )}
                                    </span>
                                </div>
                                <div className="sm:col-span-3 flex justify-end mt-2 gap-2">
                                    {canReview && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() =>
                                                setReviewBookingId(booking.id)
                                            }
                                        >
                                            Write Review
                                        </Button>
                                    )}
                                    <Link href={`/bookings/${booking.id}`}>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="container py-10 max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">My Bookings</h1>
                    <p className="text-muted-foreground">
                        View your past and upcoming bookings.
                    </p>
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

            {reviewBookingId && (
                <ReviewDialog
                    bookingId={reviewBookingId}
                    isOpen={!!reviewBookingId}
                    onClose={() => setReviewBookingId(null)}
                />
            )}
        </div>
    );
}
