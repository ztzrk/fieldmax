"use client";

import { useState } from "react";

import { useGetFieldById } from "@/hooks/useFields";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, ArrowLeft, CalendarDays, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FieldDetailSkeleton } from "./components/FieldDetailSkeleton";
import { toast } from "sonner";
import { MediaCarousel } from "@/components/shared/MediaCarousel";
import { BookingModal } from "@/components/bookings/BookingModal";
import Script from "next/script";
import { ScheduleDisplay } from "@/components/shared/fields/ScheduleDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { ReviewList } from "@/components/reviews/ReviewList";
import { FieldBookingSidebar } from "./components/FieldBookingSidebar";

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

    if (isLoading) return <FieldDetailSkeleton />;
    if (isError || !field)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-xl font-semibold">Lapangan tidak ditemukan</h2>
                <Button variant="outline" asChild>
                    <Link href="/fields">Jelajahi Lapangan Lainnya</Link>
                </Button>
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
            toast.error("Pemesanan hanya dapat dilakukan oleh pengguna (User).");
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
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground -ml-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10 relative">
                {/* Left Column: Media & Content (span 2) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Section (Mobile Only - usually shown above image on mobile) */}
                    <div className="block lg:hidden space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="text-primary bg-primary/10 rounded-full px-3 py-1"
                            >
                                {field.sportType.name}
                            </Badge>
                            {field.isClosed && (
                                <Badge
                                    variant="destructive"
                                    className="rounded-full px-3 py-1"
                                >
                                    Tutup
                                </Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-foreground font-medium ml-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>
                                    {field.rating?.toFixed(1) || "0.0"}
                                </span>
                                <span className="text-muted-foreground">
                                    ({field.reviewCount || 0} ulasan)
                                </span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {field.name}
                        </h1>
                        <Link
                            href={`/venues/${field.venue.id}`}
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                        >
                            <MapPin className="h-4 w-4 shrink-0 text-primary" />
                            <span>{field.venue.name}</span>
                        </Link>
                    </div>

                    {/* Image Carousel */}
                    <div className="rounded-2xl overflow-hidden border border-border/60 shadow-md bg-muted/20">
                        <MediaCarousel
                            photos={field.photos || []}
                            alt={field.name}
                            placeholderIcon={
                                <Trophy className="h-24 w-24 text-muted-foreground/20" />
                            }
                        />
                    </div>

                    {/* Content Section */}
                    <div className="space-y-8">
                        {/* Header Section (Desktop Only) */}
                        <div className="hidden lg:block space-y-3">
                            <div className="flex flex-wrap items-center gap-2.5">
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
                                        Tutup
                                    </Badge>
                                )}
                                <div className="flex items-center gap-1 text-sm text-foreground font-medium ml-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>
                                        {field.rating?.toFixed(1) || "0.0"}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({field.reviewCount || 0} ulasan)
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-3xl xl:text-4xl font-bold tracking-tight text-foreground">
                                {field.name}
                            </h1>
                            <Link
                                href={`/venues/${field.venue.id}`}
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-base font-medium"
                            >
                                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                <span>{field.venue.name}</span>
                            </Link>
                        </div>

                        {/* Description */}
                        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 space-y-3">
                            <h3 className="text-lg font-semibold">
                                Tentang Lapangan Ini
                            </h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                {field.description ||
                                    "Belum ada deskripsi untuk lapangan ini."}
                            </p>
                        </div>

                        {/* Schedule */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                <h3 className="text-xl font-semibold">
                                    Jadwal Mingguan
                                </h3>
                            </div>
                            <Card className="rounded-2xl border-border/60 bg-card/60 shadow-none">
                                <CardContent className="pt-6">
                                    <ScheduleDisplay
                                        schedules={field.venue.schedules || []}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Reviews */}
                        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">
                                    Ulasan &amp; Penilaian
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
                    <FieldBookingSidebar
                        pricePerHour={field.pricePerHour}
                        isClosed={field.isClosed}
                        isRoleRestricted={Boolean(user && user.role !== "USER")}
                        onBook={handleBook}
                    />
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
