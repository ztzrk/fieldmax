"use client";

import { useState } from "react";

import { useGetFieldById } from "@/hooks/useFields";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { BookingModal } from "@/components/bookings/BookingModal";
import Script from "next/script";
import { ScheduleDisplay } from "@/components/shared/fields/ScheduleDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

/**
 * FieldDetailPage Component
 *
 * Detailed view of a specific field. Displays photos, description, schedule,
 * and allows authenticated users to book the field.
 */
export default function FieldDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const fieldId = params.fieldId as string;
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const { data: field, isLoading, isError } = useGetFieldById(fieldId);

    if (isLoading) return <FullScreenLoader />;
    if (isError || !field)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-xl font-semibold">Field not found</h2>
                <Link href="/search">
                    <Button variant="outline">Browse Fields</Button>
                </Link>
            </div>
        );

    const handleBook = () => {
        if (!user) {
            router.push(
                "/login?callbackUrl=" + encodeURIComponent(`/fields/${fieldId}`)
            );
            return;
        }

        if (user.role !== "USER") {
            toast.error("Booking is restricted to Users only.");
            return;
        }

        setIsBookingModalOpen(true);
    };

    return (
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6">
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />

            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-xl border bg-muted aspect-video relative">
                        {field.photos && field.photos.length > 0 ? (
                            <Carousel className="w-full h-full">
                                <CarouselContent>
                                    {field.photos.map(
                                        (photo: {
                                            url: string;
                                            id: string;
                                        }) => (
                                            <CarouselItem key={photo.id}>
                                                <div className="aspect-video w-full relative">
                                                    <img
                                                        src={photo.url}
                                                        alt={field.name}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        )
                                    )}
                                </CarouselContent>
                                {field.photos.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4" />
                                        <CarouselNext className="right-4" />
                                    </>
                                )}
                            </Carousel>
                        ) : (
                            <ImagePlaceholder
                                variant="pattern"
                                icon={
                                    <Trophy className="h-24 w-24 text-muted-foreground/20" />
                                }
                                className="h-full w-full"
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Badge
                                variant="secondary"
                                className="text-primary bg-primary/10 hover:bg-primary/20"
                            >
                                {field.sportType.name}
                            </Badge>
                            {field.isClosed && (
                                <Badge variant="destructive">Closed</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            {field.name}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="text-lg">{field.venue.name}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 p-6 bg-muted/30 rounded-lg border">
                        <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                            Price
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-primary">
                                {formatPrice(field.pricePerHour)}
                            </span>
                            <span className="text-muted-foreground">
                                / hour
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {field.description ||
                                "No description available for this field."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-semibold">
                                Weekly Schedule
                            </h3>
                        </div>
                        <Card className="bg-muted/30">
                            <CardContent className="pt-6">
                                <ScheduleDisplay
                                    schedules={field.venue.schedules || []}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="pt-6 mt-auto">
                        <Button
                            size="lg"
                            className="w-full text-lg h-12 gap-2"
                            onClick={handleBook}
                        >
                            Book Now <ArrowRight className="h-5 w-5" />
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-3">
                            Instant confirmation • Secure payment
                        </p>
                    </div>
                </div>
            </div>

            <BookingModal
                fieldId={fieldId}
                fieldName={field.name}
                venueName={field.venue.name}
                pricePerHour={field.pricePerHour}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />
        </div>
    );
}
