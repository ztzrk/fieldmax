"use client";

import { useState } from "react";

import { useGetFieldById } from "@/hooks/useFields";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Trophy,
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Star,
    ShieldCheck,
} from "lucide-react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReviewList } from "@/components/reviews/ReviewList";

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

    // Config for reviews
    const [page, setPage] = useState(1);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

    const {
        data: field,
        isLoading,
        isError,
    } = useGetFieldById(fieldId, page, 10, selectedRatings);

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
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6 min-h-screen bg-background pb-20">
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />

            {/* Breadcrumb / Back Navigation */}
            <div className="mb-6">
                <Button
                    variant="link"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                {/* Left Column: Media & Content (span 2) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Section (Mobile Only - usually shown above image on mobile) */}
                    <div className="block lg:hidden space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="text-primary bg-primary/10"
                            >
                                {field.sportType.name}
                            </Badge>
                            {field.isClosed && (
                                <Badge variant="destructive">Closed</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {field.name}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <Button
                                variant="link"
                                onClick={() => {
                                    router.push(`/venues/${field.venue.id}`);
                                }}
                                className="hover:underline hover:text-primary transition-colors"
                            >
                                {field.venue.name}
                            </Button>
                        </div>
                    </div>

                    {/* Image Carousel */}
                    <div className="overflow-hidden rounded-2xl border bg-muted aspect-video relative shadow-sm">
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
                                        <CarouselPrevious className="left-4 bg-background/80 hover:bg-background" />
                                        <CarouselNext className="right-4 bg-background/80 hover:bg-background" />
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

                    {/* Content Section */}
                    <div className="space-y-8">
                        {/* Header Section (Desktop Only) */}
                        <div className="hidden lg:block space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1 text-sm font-medium rounded-full"
                                        >
                                            {field.sportType.name}
                                        </Badge>
                                        {field.isClosed && (
                                            <Badge
                                                variant="destructive"
                                                className="rounded-full px-3 py-1"
                                            >
                                                Closed
                                            </Badge>
                                        )}
                                        <div className="flex items-center gap-1 text-sm text-foreground font-medium ml-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span>
                                                {field.rating?.toFixed(1) ||
                                                    "0.0"}
                                            </span>
                                            <span className="text-muted-foreground">
                                                ({field.reviewCount || 0}{" "}
                                                reviews)
                                            </span>
                                        </div>
                                    </div>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                                        {field.name}
                                    </h1>
                                    <div className="flex items-center gap-2 text-muted-foreground text-base">
                                        <MapPin className="h-5 w-5 shrink-0 text-primary" />
                                        <Button
                                            variant="link"
                                            onClick={() => {
                                                router.push(
                                                    `/venues/${field.venue.id}`
                                                );
                                            }}
                                            className="hover:underline hover:text-primary transition-colors"
                                        >
                                            {field.venue.name}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold border-b pb-2">
                                About this Field
                            </h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {field.description ||
                                    "No description available for this field."}
                            </p>
                        </div>

                        {/* Schedule */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                <h3 className="text-xl font-semibold">
                                    Weekly Schedule
                                </h3>
                            </div>
                            <Card className="bg-muted/30 border-none shadow-none">
                                <CardContent className="pt-6">
                                    <ScheduleDisplay
                                        schedules={field.venue.schedules || []}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-6 pt-6 border-t">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-semibold">
                                    Reviews & Ratings
                                </h3>
                            </div>
                            <ReviewList
                                reviews={field.reviews?.data || []}
                                meta={field.reviews?.meta}
                                onPageChange={setPage}
                                onRatingChange={(rating) => {
                                    setPage(1);
                                    setSelectedRatings((prev) =>
                                        prev.includes(rating)
                                            ? prev.filter((r) => r !== rating)
                                            : [...prev, rating]
                                    );
                                }}
                                onClearFilter={() => setSelectedRatings([])}
                                selectedRatings={selectedRatings}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Booking Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-border shadow-lg overflow-hidden rounded-xl">
                            <CardHeader className="bg-muted/40 pb-6 border-b">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Price per hour
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-primary">
                                            {formatPrice(field.pricePerHour)}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-2">
                                    {field.isClosed ? (
                                        <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium text-center border border-destructive/20">
                                            This field is currently closed.
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-sm font-medium text-center border border-green-500/20">
                                            Available for booking
                                        </div>
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full text-lg h-14 font-semibold shadow-md transition-all hover:shadow-lg"
                                    onClick={handleBook}
                                    disabled={field.isClosed}
                                >
                                    {field.isClosed
                                        ? "Unavailable"
                                        : "Book Now"}
                                    {!field.isClosed && (
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    )}
                                </Button>

                                <div className="pt-2 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4 text-green-600" />
                                        <span>Secure Booking & Payment</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
