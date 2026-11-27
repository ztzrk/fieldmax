"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { VenuePublicSchema } from "@fieldmax/shared";
import { cn } from "@/lib/utils";

interface VenueCardProps {
    venue: VenuePublicSchema;
    priority?: boolean;
}

export function VenueCard({ venue, priority = false }: VenueCardProps) {
    const [imageError, setImageError] = useState(false);
    const pathname = usePathname();
    const isRenterPage = pathname?.startsWith("/renters");

    return (
        <Card className="h-full flex flex-col p-0 overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg group">
            {/* Image Section */}
            <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                <Link
                    href={`/venues/${venue.id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`Lihat tempat ${venue.name}`}
                >
                    {venue.photos?.[0]?.url && !imageError ? (
                        <Image
                            src={venue.photos[0].url}
                            alt={venue.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            loading="eager"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <ImagePlaceholder
                            variant="pattern"
                            icon={<Building2 className="h-8 w-8 opacity-20" />}
                        />
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                {/* Badge Overlay */}
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                    <Badge
                        variant="secondary"
                        className="backdrop-blur-md bg-background/80 shadow-sm border-white/20"
                    >
                        {venue._count?.fields || 0} Lapangan
                    </Badge>
                </div>

                {/* Hover Action */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 pointer-events-none">
                    <Link
                        href={`/venues/${venue.id}`}
                        className={cn(
                            buttonVariants({ variant: "default", size: "sm" }),
                            "bg-white text-slate-900 hover:bg-white/90 shadow-lg font-medium relative z-10 pointer-events-auto"
                        )}
                    >
                        Lihat Tempat
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <CardHeader className="p-4 pb-2 space-y-1">
                <CardTitle className="line-clamp-1 text-base font-bold group-hover:text-primary transition-colors">
                    <Link
                        href={`/venues/${venue.id}`}
                        className="hover:underline"
                        title={venue.name}
                    >
                        {venue.name}
                    </Link>
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-col flex flex-1">
                {!isRenterPage && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2 min-w-0">
                        <span className="shrink-0">Dikelola oleh</span>
                        <Link
                            href={`/renters/${venue.renterId}`}
                            className="font-medium hover:underline text-primary/80 hover:text-primary transition-colors truncate"
                            title={
                                venue.renter?.profile?.companyName ||
                                venue.renter?.fullName ||
                                "Pengelola"
                            }
                        >
                            {venue.renter?.profile?.companyName ||
                                venue.renter?.fullName ||
                                "Pengelola"}
                        </Link>
                    </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 min-w-0">
                    <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                    <span
                        className="truncate"
                        title={
                            venue.address ||
                            [venue.district, venue.city]
                                .filter(Boolean)
                                .join(", ") ||
                            undefined
                        }
                    >
                        {venue.address ||
                            [venue.district, venue.city]
                                .filter(Boolean)
                                .join(", ") ||
                            "Alamat belum ditambahkan"}
                    </span>
                </div>

                <Link
                    href={`/venues/${venue.id}`}
                    className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <span className="text-xs text-muted-foreground font-medium tabular-nums">
                        {venue.bookingCount !== undefined
                            ? `${venue.bookingCount} Pesanan`
                            : "Tempat Baru"}
                    </span>
                    <div className="flex items-center text-xs font-semibold text-primary">
                        <span>Lihat Detail</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}
