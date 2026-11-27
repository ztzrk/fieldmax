"use client";

import { useGetPublicVenueById } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, Building2, Share2, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { MediaCarousel } from "@/components/shared/MediaCarousel";
import { toast } from "sonner";

import { FieldCard } from "@/components/fields/FieldCard";
import { VenueInfoSidebar } from "./components/VenueInfoSidebar";
import { FieldResponseSchema } from "@/lib/schema/field.schema";

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
                <h2 className="text-xl font-semibold">Tempat olahraga tidak ditemukan</h2>
                <Button variant="outline" asChild>
                    <Link href="/">Kembali ke Beranda</Link>
                </Button>
            </div>
        );

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Tautan berhasil disalin!");
    };

    return (
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6 min-h-screen bg-background pb-20">
            {/* Breadcrumb Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground -ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2 rounded-full"
                    title="Bagikan Tempat Olahraga"
                >
                    <Share2 className="h-4 w-4" />
                    Bagikan
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Image Gallery */}
                    <div className="rounded-2xl overflow-hidden border border-border/60 shadow-md bg-muted/20">
                        <MediaCarousel
                            photos={venue.photos || []}
                            alt={venue.name}
                            placeholderIcon={
                                <Building2 className="h-24 w-24 text-muted-foreground/20" />
                            }
                            showGradient
                            hoverControls
                        />
                    </div>

                    {/* Venue Header & Description */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {venue.city && (
                                    <Badge
                                        variant="secondary"
                                        className="text-primary bg-primary/10 hover:bg-primary/20 rounded-full px-3 py-1"
                                    >
                                        {venue.city}
                                    </Badge>
                                )}
                                <Badge
                                    variant="outline"
                                    className="rounded-full px-3 py-1"
                                >
                                    {venue.fields.length} Lapangan Tersedia
                                </Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                {venue.name}
                            </h1>
                            <div className="flex items-start gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0 text-primary mt-1" />
                                <span className="text-base">
                                    {venue.address}
                                    {venue.district
                                        ? `, ${venue.district}`
                                        : ""}
                                    {venue.city ? `, ${venue.city}` : ""}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 space-y-3">
                            <h3 className="text-lg font-semibold text-foreground">
                                Tentang Tempat Olahraga Ini
                            </h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                {venue.description ||
                                    "Belum ada deskripsi untuk tempat olahraga ini."}
                            </p>
                        </div>
                    </div>

                    {/* Available Fields Section */}
                    <section className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold tracking-tight">
                                Lapangan Tersedia ({venue.fields.length})
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                        } as FieldResponseSchema
                                    }
                                />
                            ))}
                        </div>
                        {venue.fields.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                                <Trophy className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>
                                    Belum ada lapangan tersedia di tempat olahraga ini.
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
