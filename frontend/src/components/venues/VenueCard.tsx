"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { VenuePublicSchema } from "@/lib/schema/venue.schema";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface VenueCardProps {
    venue: VenuePublicSchema;
}

export function VenueCard({ venue }: VenueCardProps) {
    const [imageError, setImageError] = useState(false);
    const pathname = usePathname();
    const isRenterPage = pathname?.startsWith("/renters");

    return (
        <Card className="h-full flex flex-col p-0 overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg group relative">
            <Link href={`/venues/${venue.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">View {venue.name}</span>
            </Link>
            {/* Image Section */}
            <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                {!imageError ? (
                    <img
                        src={venue.photos?.[0].url}
                        alt={venue.name}
                        onError={() => {
                            setImageError(true);
                        }}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <ImagePlaceholder
                        variant="pattern"
                        icon={<Building2 className="h-8 w-8 opacity-20" />}
                    />
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge Overlay */}
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                    <Badge
                        variant="secondary"
                        className="backdrop-blur-md bg-background/80 shadow-sm border-white/20"
                    >
                        {venue._count?.fields || 0} Fields
                    </Badge>
                </div>

                {/* Hover Action */}
                <div className="absolute inset-x-0 bottom-4 flex justify-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 pointer-events-none">
                    <Link
                        href={`/venues/${venue.id}`}
                        className={cn(
                            buttonVariants({ variant: "default", size: "sm" }),
                            "bg-white text-black hover:bg-white/90 shadow-lg font-medium relative z-10 pointer-events-auto"
                        )}
                    >
                        View Venue
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <CardHeader className="p-4 pb-2 space-y-1">
                <CardTitle
                    className="line-clamp-1 text-base font-bold group-hover:text-primary transition-colors"
                    title={venue.name}
                >
                    {venue.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-col flex flex-1">
                {!isRenterPage && (
                    <div className="text-xs text-muted-foreground mb-2 relative z-10">
                        Managed by{" "}
                        <Link
                            href={`/renters/${venue.renterId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium hover:underline text-primary/80 hover:text-primary transition-colors"
                        >
                            {venue.renter == undefined
                                ? "Unknown"
                                : venue.renter.fullName}
                        </Link>
                    </div>
                )}

                {/* Location: Swaps between simple address and city/district on hover if available */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" />
                    <div className="relative flex-1 h-9">
                        <span className="line-clamp-2 transition-all duration-300 group-hover:opacity-0 absolute inset-0">
                            {venue.address || "No address provided"}
                        </span>
                        <span className="line-clamp-2 transition-all duration-300 opacity-0 group-hover:opacity-100 absolute inset-0">
                            {[venue.district, venue.city]
                                .filter(Boolean)
                                .join(", ") || venue.address}
                        </span>
                    </div>
                </div>

                <Link
                    href={`/venues/${venue.id}`}
                    className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between relative z-10"
                >
                    <span className="text-xs text-muted-foreground font-medium">
                        {venue.bookingCount !== undefined
                            ? `${venue.bookingCount} Bookings`
                            : "New Venue"}
                    </span>
                    <div className="flex items-center text-xs font-semibold text-primary overflow-hidden">
                        <span className="translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            Details
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1 -translate-x-4 group-hover:translate-x-0 transition-transform duration-300" />
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
}
