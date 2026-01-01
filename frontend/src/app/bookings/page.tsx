"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, History, Ticket } from "lucide-react";
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
            <div className="container py-20 flex flex-col items-center justify-center gap-4 min-h-[50vh]">
                <div className="h-12 w-12 bg-destructive/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold">
                    Failed to load bookings
                </h2>
                <p className="text-muted-foreground">
                    We couldn't fetch your booking history. Please try again.
                </p>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
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
            <div className="flex flex-col gap-4">
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
        <div className="min-h-screen bg-muted/5">
            {/* Header Section */}
            <div className="bg-background border-b sticky top-16 z-10 pt-8 pb-4">
                <div className="container max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col gap-6">
                        <Link
                            href="/"
                            className="inline-flex w-fit text-muted-foreground hover:text-foreground transition-colors text-sm font-medium items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    My Bookings
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    Manage your upcoming games and view history
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="w-full sm:w-auto grid grid-cols-2 h-12 p-1 bg-muted/50 rounded-full mb-8">
                        <TabsTrigger
                            value="active"
                            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg shadow-primary/20 transition-all font-medium"
                        >
                            <Ticket className="w-4 h-4 mr-2" />
                            Active Tickets
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg shadow-primary/20 transition-all font-medium"
                        >
                            <History className="w-4 h-4 mr-2" />
                            Order History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="active"
                        className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-2"
                    >
                        <BookingList list={activeBookings} />
                    </TabsContent>

                    <TabsContent
                        value="history"
                        className="space-y-6 animate-in fade-in-50 duration-500 slide-in-from-bottom-2"
                    >
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
        </div>
    );
}
