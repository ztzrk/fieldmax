"use client";

import { useGetPublicVenueById } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

/**
 * VenueDetailPage Component
 *
 * Detailed view of a specific venue. Displays detailed info, location,
 * photo gallery, and a list of available fields within the venue.
 */
export default function VenueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const venueId = params.venueId as string;
    const { user } = useAuth();

    const { data: venue, isLoading, isError } = useGetPublicVenueById(venueId);

    if (isLoading) return <FullScreenLoader />;
    if (isError || !venue)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-xl font-semibold">Venue not found</h2>
                <Link href="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        );

    return (
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-xl border bg-muted aspect-video relative">
                        {venue.photos && venue.photos.length > 0 ? (
                            <Carousel className="w-full h-full">
                                <CarouselContent>
                                    {venue.photos.map(
                                        (
                                            photo: { url: string; id?: string },
                                            index
                                        ) => (
                                            <CarouselItem
                                                key={photo.id || index}
                                            >
                                                <div className="aspect-video w-full relative">
                                                    <img
                                                        src={photo.url}
                                                        alt={venue.name}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                </div>
                                            </CarouselItem>
                                        )
                                    )}
                                </CarouselContent>
                                {venue.photos.length > 1 && (
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
                                    <Building2 className="h-24 w-24 text-muted-foreground/20" />
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
                                Venue
                            </Badge>
                            <Badge variant="outline">
                                {venue.fields.length} Fields
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            {venue.name}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="text-lg">{venue.address}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">
                            About this Venue
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {venue.description ||
                                "No description available for this venue."}
                        </p>
                    </div>

                    {/* 
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <CalendarClock className="h-4 w-4" />
                        <span>Open today: 08:00 - 22:00</span>
                    </div> */}
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">
                    Available Fields in {venue.name}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {venue.fields.map((field) => (
                        <Card
                            key={field.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group h-full flex flex-col"
                            onClick={() => router.push(`/fields/${field.id}`)}
                        >
                            <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                {field.photos && field.photos.length > 0 ? (
                                    <img
                                        src={field.photos[0].url}
                                        alt={field.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                    />
                                ) : (
                                    <ImagePlaceholder
                                        variant="pattern"
                                        icon={
                                            <Trophy className="h-8 w-8 opacity-20" />
                                        }
                                    />
                                )}
                            </div>
                            <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between items-start">
                                    <div className="w-full">
                                        <Badge
                                            variant="outline"
                                            className="mb-1 text-[10px] px-1.5 py-0 h-4"
                                        >
                                            {field.sportTypeName}
                                        </Badge>
                                        <CardTitle
                                            className="line-clamp-1 text-sm font-semibold"
                                            title={field.name}
                                        >
                                            {field.name}
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-2 flex-col flex flex-1">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                    <MapPin className="h-3 w-3 shrink-0" />
                                    <span className="line-clamp-1">
                                        {venue.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-sm font-bold">
                                        {formatPrice(field.pricePerHour)}/hr
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-7 px-2 text-xs gap-1 hover:bg-primary hover:text-primary-foreground"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!user) {
                                                window.location.href = "/login";
                                                return;
                                            }

                                            if (user.role !== "USER") {
                                                toast.error(
                                                    "Booking is restricted to Users only."
                                                );
                                                return;
                                            }

                                            router.push(`/fields/${field.id}`);
                                        }}
                                    >
                                        Book{" "}
                                        <ArrowRight className="h-2.5 w-2.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {venue.fields.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
                            No fields available in this venue currently.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
