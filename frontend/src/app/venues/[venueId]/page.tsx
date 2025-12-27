"use client";

import { useGetPublicVenueById } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, ArrowLeft, ArrowRight, Building2, CalendarClock } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export default function VenueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const venueId = params.venueId as string;

    const { data: venue, isLoading, isError } = useGetPublicVenueById(venueId);

    if (isLoading) return <FullScreenLoader />;
    if (isError || !venue) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <h2 className="text-xl font-semibold">Venue not found</h2>
            <Link href="/">
                <Button variant="outline">Back to Home</Button>
            </Link>
        </div>
    );

    return (
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                {/* Left Column: Image Gallery */}
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-xl border bg-muted aspect-video relative">
                        {venue.photos && venue.photos.length > 0 ? (
                            <Carousel className="w-full h-full">
                                <CarouselContent>
                                    {venue.photos.map((photo: { url: string; id?: string }, index) => (
                                        <CarouselItem key={photo.id || index}>
                                            <div className="aspect-video w-full relative">
                                                <img 
                                                    src={photo.url} 
                                                    alt={venue.name}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {venue.photos.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4" />
                                        <CarouselNext className="right-4" />
                                    </>
                                )}
                            </Carousel>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-muted/50">
                                <Building2 className="h-24 w-24 text-muted-foreground/20" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-primary bg-primary/10 hover:bg-primary/20">
                                Venue
                            </Badge>
                            <Badge variant="outline">
                                {venue.fields.length} Fields
                            </Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{venue.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="text-lg">{venue.address}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">About this Venue</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {venue.description || "No description available for this venue."}
                        </p>
                    </div>

                    {/* Operating Hours (if available in future) */}
                    {/* 
                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <CalendarClock className="h-4 w-4" />
                        <span>Open today: 08:00 - 22:00</span>
                    </div> */}
                </div>
            </div>

            {/* Fields List */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Available Fields in {venue.name}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {venue.fields.map((field) => (
                        <Card 
                            key={field.id} 
                            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                            onClick={() => router.push(`/fields/${field.id}`)}
                        >
                            <div className="flex flex-row sm:flex-col h-full">
                                {/* Placeholder Image for field since backend doesn't return it for venue detail */}
                                <div className="w-1/3 sm:w-full sm:aspect-[4/3] bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden shrink-0">
                                    <Trophy className="h-8 w-8 opacity-20" />
                                </div>
                                
                                <CardContent className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <Badge variant="outline" className="mb-2 text-[10px]">
                                            {field.sportTypeName}
                                        </Badge>
                                        <CardTitle className="text-base font-semibold mb-1" title={field.name}>
                                            {field.name}
                                        </CardTitle>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm font-bold text-primary">
                                            {formatPrice(field.pricePerHour)}/hr
                                        </span>
                                        <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">
                                            View
                                        </Button>
                                    </div>
                                </CardContent>
                            </div>
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
