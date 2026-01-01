"use client";

import { useGetPublicVenueById } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Trophy,
    ArrowLeft,
    ArrowRight,
    Building2,
    ShieldCheck,
    Share2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

import { FieldCard } from "@/components/fields/FieldCard";

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

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6 min-h-screen bg-background pb-20">
            {/* Breadcrumb Navigation */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image Gallery */}
                    <div className="rounded-2xl overflow-hidden border bg-muted aspect-video relative shadow-sm group">
                        {venue.photos && venue.photos.length > 0 ? (
                            <Carousel className="w-full h-full">
                                <CarouselContent>
                                    {venue.photos.map((photo, index) => (
                                        <CarouselItem key={photo.id || index}>
                                            <div className="aspect-video w-full relative">
                                                <img
                                                    src={photo.url}
                                                    alt={venue.name}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {venue.photos.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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

                    {/* Venue Header & Description */}
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                        variant="secondary"
                                        className="text-primary bg-primary/10 hover:bg-primary/20"
                                    >
                                        In {venue.city || "City"}
                                    </Badge>
                                    <Badge variant="outline">
                                        {venue.fields.length} Fields Available
                                    </Badge>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                    {venue.name}
                                </h1>
                                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                    <MapPin className="h-4 w-4 shrink-0" />
                                    <span className="text-lg">
                                        {venue.address}
                                        {venue.district
                                            ? `, ${venue.district}`
                                            : ""}
                                        {venue.city ? `, ${venue.city}` : ""}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleShare}
                                className="shrink-0 rounded-full"
                                title="Share Venue"
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="prose prose-slate max-w-none text-muted-foreground">
                            <h3 className="text-xl font-semibold text-foreground mb-3">
                                About this Venue
                            </h3>
                            <p className="leading-relaxed whitespace-pre-line">
                                {venue.description ||
                                    "No description available for this venue."}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Available Fields Section */}
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight mb-6">
                            Available Fields ({venue.fields.length})
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {venue.fields.map((field) => (
                                <FieldCard
                                    key={field.id}
                                    field={
                                        {
                                            ...field,
                                            sportType: {
                                                id: "",
                                                name: field.sportTypeName,
                                            },
                                            venue: {
                                                name: venue.name,
                                                id: venue.id,
                                            },
                                            description: "",
                                            status: "APPROVED",
                                            isClosed: false,
                                            createdAt: new Date(),
                                            updatedAt: new Date(),
                                            sportTypeId: "",
                                            venueId: venue.id,
                                        } as any
                                    }
                                />
                            ))}
                        </div>
                        {venue.fields.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                                <Trophy className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>
                                    No fields available in this venue currently.
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar - Right Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
                            <CardHeader className="uppercase text-xs font-bold text-muted-foreground tracking-wider pb-2">
                                Venue Information
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-medium text-sm block">
                                                Address
                                            </span>
                                            <p className="text-sm text-muted-foreground leading-snug">
                                                {venue.address}
                                                <br />
                                                {venue.city}, {venue.province}{" "}
                                                {venue.postalCode}
                                            </p>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                    `${venue.name} ${venue.address}`
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-1"
                                            >
                                                Get Directions{" "}
                                                <ArrowRight className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-medium text-sm block">
                                                Verified Venue
                                            </span>
                                            <p className="text-sm text-muted-foreground leading-snug">
                                                FieldMax has verified this venue
                                                listing for accuracy.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="pt-2">
                                    <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
                                        Have questions? Contact the venue
                                        directly upon booking confirmation.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
