"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { formatDate, formatTime } from "@/lib/utils";
import { StarRating } from "@/components/reviews/StarRating";

interface BookingCardProps {
    booking: BookingResponseSchema;
    onReview?: (bookingId: string) => void;
    isPast?: boolean;
}

/**
 * BookingCard Component
 *
 * Displays a single booking with venue, time, and status information.
 */
export function BookingCard({ booking, onReview, isPast }: BookingCardProps) {
    const canReview =
        (booking.status === "COMPLETED" || booking.status === "CONFIRMED") &&
        !booking.review &&
        isPast;

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
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
                            booking.paymentStatus || booking.status
                        )}
                    >
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
                        {formatTime(booking.startTime)} -{" "}
                        {formatTime(booking.endTime)}
                    </span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                    <span className="text-sm font-bold text-primary">
                        Rp {booking.totalPrice.toLocaleString("id-ID")}
                    </span>
                </div>
                <div className="sm:col-span-3 flex justify-end mt-2 gap-2">
                    {canReview && onReview && (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onReview(booking.id)}
                        >
                            Write Review
                        </Button>
                    )}
                    {booking.review && (
                        <div className="flex items-center gap-2 bg-secondary/20 px-3 py-1.5 rounded-md">
                            <span className="text-sm font-medium">
                                Your Review:
                            </span>
                            <StarRating
                                rating={booking.review.rating}
                                size={16}
                            />
                        </div>
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
}
