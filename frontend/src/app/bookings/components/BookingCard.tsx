"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { formatDate, formatTime } from "@/lib/utils";
import { StarRating } from "@/components/reviews/StarRating";
import { cn } from "@/lib/utils";

interface BookingCardProps {
    booking: BookingResponseSchema;
    onReview?: (bookingId: string) => void;
    isPast?: boolean;
}

export function BookingCard({ booking, onReview, isPast }: BookingCardProps) {
    const canReview =
        (booking.status === "COMPLETED" || booking.status === "CONFIRMED") &&
        !booking.review &&
        isPast;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
            case "PAID":
                return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900";
            case "PENDING":
                return "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900";
            case "CANCELLED":
            case "FAILED":
                return "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900";
            case "COMPLETED":
                return "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900";
            default:
                return "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-800";
        }
    };

    return (
        <Card className="group overflow-hidden py-0 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex flex-col sm:flex-row">
                {/* Left Side: Date & Time Highlight */}
                <div className="sm:w-32 bg-muted/30 border-b sm:border-b-0 sm:border-r flex sm:flex-col items-center justify-center p-4 gap-2 sm:gap-1 text-center group-hover:bg-primary/5 transition-colors">
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {new Date(booking.bookingDate).toLocaleDateString(
                                "en-US",
                                { month: "short" }
                            )}
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                            {new Date(booking.bookingDate).getDate()}
                        </span>
                    </div>
                    <div className="hidden sm:block w-8 h-[1px] bg-border my-2" />
                    <div className="text-xs text-muted-foreground font-medium">
                        {formatTime(booking.startTime)}
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                    {booking.field?.venue?.name ||
                                        "Unknown Venue"}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                    <MapPin className="h-3.5 w-3.5 text-primary/70" />
                                    <span className="line-clamp-1">
                                        {booking.field?.venue?.city ||
                                            "Location details"}
                                    </span>
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "font-medium border shadow-none",
                                    getStatusColor(
                                        booking.paymentStatus || booking.status
                                    )
                                )}
                            >
                                {booking.paymentStatus || booking.status}
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm border-t pt-3 border-dashed">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">
                                    Field
                                </span>
                                <span className="font-medium">
                                    {booking.field?.name}
                                </span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-muted-foreground">
                                    Total
                                </span>
                                <span className="font-bold text-lg text-primary">
                                    Rp{" "}
                                    {booking.totalPrice.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 pt-2">
                        {canReview && onReview && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 text-xs bg-secondary/80 hover:bg-secondary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onReview(booking.id);
                                }}
                            >
                                Write Review
                            </Button>
                        )}
                        {booking.review && (
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                                <StarRating
                                    rating={booking.review.rating}
                                    size={12}
                                />
                                <span className="text-[10px] font-medium text-yellow-700 dark:text-yellow-500 uppercase tracking-wide">
                                    Reviewed
                                </span>
                            </div>
                        )}

                        <Link
                            href={`/bookings/${booking.id}`}
                            className="flex-1 sm:flex-none"
                        >
                            <Button
                                className="w-full sm:w-auto h-8 text-xs group/btn"
                                size="sm"
                            >
                                Details
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    );
}
