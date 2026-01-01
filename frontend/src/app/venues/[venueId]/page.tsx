"use client";

import { useGetPublicVenueById } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, Building2, Share2, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { MediaCarousel } from "@/components/shared/MediaCarousel";
import { toast } from "sonner";

import { FieldCard } from "@/components/fields/FieldCard";
import { VenueInfoSidebar } from "./components/VenueInfoSidebar";

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
                    <MediaCarousel
                        photos={venue.photos || []}
                        alt={venue.name}
                        placeholderIcon={
                            <Building2 className="h-24 w-24 text-muted-foreground/20" />
                        }
                        showGradient
                        hoverControls
                    />

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
                    <VenueInfoSidebar
                        name={venue.name}
                        address={venue.address}
                        city={venue.city}
                        province={venue.province}
                        postalCode={venue.postalCode}
                    />
                </div>
            </div>
        </div>
    );
}
