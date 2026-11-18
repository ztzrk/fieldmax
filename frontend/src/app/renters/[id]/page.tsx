"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetPublicRenter } from "@/hooks/useGetPublicRenter";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { VenueCard } from "@/components/venues/VenueCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowLeft,
    Building2,
    ExternalLink,
    Globe,
} from "lucide-react";

export default function RenterProfilePage() {
    const router = useRouter();
    const params = useParams();
    const renterId = params.id as string;

    const {
        data: profileData,
        isLoading,
        isError,
    } = useGetPublicRenter(renterId);

    if (isLoading) return <FullScreenLoader />;
    if (isError || !profileData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-xl font-semibold">Mitra Tidak Ditemukan</h2>
                <p className="text-muted-foreground">
                    Profil mitra yang Anda cari tidak tersedia.
                </p>
                <Link href="/renters">
                    <Button variant="outline">Lihat Semua Mitra</Button>
                </Link>
            </div>
        );
    }

    const { renter, venues } = profileData;
    const profile = renter.profile || {};
    const displayName = profile.companyName || renter.fullName;
    const logo =
        profile.companyLogoUrl || profile.profilePictureUrl || undefined;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Cover Banner */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-slate-950 to-orange-600/30" />
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
                <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

                <div className="container relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 pt-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-white/85 hover:text-white hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                </div>
            </div>

            <div className="container max-w-[1400px] mx-auto px-4 md:px-6">
                {/* Overlapping Profile Card */}
                <Card className="-mt-16 relative z-20 rounded-2xl border-border/70 shadow-lg bg-card/95 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                        <Avatar className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-background shadow-xl shrink-0">
                            <AvatarImage
                                src={logo}
                                alt={displayName}
                                className="object-cover"
                            />
                            <AvatarFallback className="rounded-2xl text-3xl font-bold bg-primary text-primary-foreground">
                                {displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    {displayName}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
                                    <Badge
                                        variant="secondary"
                                        className="gap-1.5 px-3 py-1 text-xs font-medium"
                                    >
                                        <Building2 className="h-3.5 w-3.5 text-primary" />
                                        {venues.length} Tempat Olahraga
                                    </Badge>
                                    {profile.companyWebsite && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="gap-1.5 h-8"
                                        >
                                            <a
                                                href={profile.companyWebsite}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Globe className="h-3.5 w-3.5" />
                                                Situs Web
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {profile.companyDescription && (
                                <p className="max-w-3xl text-muted-foreground leading-relaxed text-sm sm:text-base">
                                    {profile.companyDescription}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Venues Grid */}
                <div className="mt-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Tempat Olahraga Tersedia
                        </h2>
                    </div>

                    {venues.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {venues.map((venue: any) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-14 bg-muted/20 rounded-2xl border border-dashed text-muted-foreground">
                            <p>Belum ada tempat olahraga tersedia saat ini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
