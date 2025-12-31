"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { useRouter } from "next/navigation";
import { VenuePublicSchema } from "@/lib/schema/venue.schema";

interface VenueCardProps {
    venue: VenuePublicSchema;
}

export function VenueCard({ venue }: VenueCardProps) {
    const router = useRouter();

    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group h-full flex flex-col"
            onClick={() => router.push(`/venues/${venue.id}`)}
        >
            <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                {venue.photos && venue.photos.length > 0 ? (
                    <img
                        src={venue.photos[0].url}
                        alt={venue.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                ) : (
                    <ImagePlaceholder
                        variant="pattern"
                        icon={<Building2 className="h-8 w-8 opacity-20" />}
                    />
                )}
            </div>
            <CardHeader className="p-3 pb-0">
                <CardTitle
                    className="line-clamp-1 text-sm font-semibold"
                    title={venue.name}
                >
                    {venue.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-2 flex-col flex flex-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">
                        {venue.address || "No address provided"}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <Badge variant="secondary" className="text-[10px]">
                        {venue._count?.fields || 0} Fields
                    </Badge>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs gap-1 hover:bg-primary/10"
                    >
                        Details <ArrowRight className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
