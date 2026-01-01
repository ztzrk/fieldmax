"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetBookings } from "@/hooks/useBookings";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { ReviewDialog } from "@/components/reviews/ReviewDialog";
import { BookingCard } from "./components/BookingCard";
import { EmptyBookings } from "./components/EmptyBookings";

/**
 * BookingHistoryPage Component
 *
 * Displays a list of user bookings, separated into active tickets and order history.
 */
export default function BookingHistoryPage() {
    const { data: bookingsData, isLoading, isError } = useGetBookings(1, 100);
    const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);

    if (isLoading) return <FullScreenLoader />;

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

    // Helper to calculate end datetime
    const getEndDateTime = (booking: BookingResponseSchema) => {
        const datePart = booking.bookingDate.toString().split("T")[0];
        let timePart = booking.endTime;
        if (booking.endTime.toString().includes("T")) {
            timePart = booking.endTime.toString().split("T")[1];
        }
        return new Date(`${datePart}T${timePart}`);
    };

    const activeBookings = bookings.filter((booking: BookingResponseSchema) => {
        const endDateTime = getEndDateTime(booking);
        const isFuture = endDateTime > now;
        const isPending =
            booking.status === "PENDING" || booking.paymentStatus === "PENDING";
        return isFuture || isPending;
    });

    const historyBookings = bookings.filter(
        (booking: BookingResponseSchema) => {
            const endDateTime = getEndDateTime(booking);
            const isPast = endDateTime <= now;
            const isNotPending =
                booking.status !== "PENDING" &&
                booking.paymentStatus !== "PENDING";
            return isPast && isNotPending;
        }
    );

    const BookingList = ({
        list,
        isPast = false,
    }: {
        list: BookingResponseSchema[];
        isPast?: boolean;
    }) => {
        if (list.length === 0) return <EmptyBookings />;

        return (
            <div className="space-y-4">
                {list.map((booking) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        onReview={setReviewBookingId}
                        isPast={isPast || getEndDateTime(booking) <= now}
                    />
                ))}
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
                    <BookingList list={historyBookings} isPast />
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
