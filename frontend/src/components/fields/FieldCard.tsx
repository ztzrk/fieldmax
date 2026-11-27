"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { formatPrice } from "@/lib/utils";
import { FieldResponseSchema } from "@fieldmax/shared";
import Link from "next/link";

interface FieldCardProps {
    field: FieldResponseSchema;
    priority?: boolean;
}

export function FieldCard({ field, priority = false }: FieldCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/fields/${field.id}`}
            className="block h-full cursor-pointer group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
            <Card className="h-full flex flex-col p-0 overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                    {field.photos && field.photos.length > 0 && !imageError ? (
                        <Image
                            src={field.photos[0].url}
                            alt={field.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            loading="eager"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <ImagePlaceholder
                            variant="pattern"
                            icon={<Trophy className="h-8 w-8 opacity-20" />}
                        />
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute top-3 right-3 z-10">
                        <Badge className="bg-background/90 text-foreground shadow-sm backdrop-blur-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                            {field.sportType?.name || "Olahraga"}
                        </Badge>
                    </div>

                    {/* Status Indicator */}
                    {!field.isClosed && (
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-status-success/30 text-xs font-medium text-status-success shadow-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse motion-reduce:animate-none" />
                            Tersedia
                        </div>
                    )}
                </div>

                <CardContent className="p-4 flex flex-col flex-1 relative">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {field.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                        <span className="line-clamp-1 group-hover:text-foreground transition-colors">
                            {field.venue?.name}
                        </span>
                    </div>

                    <div className="mt-auto pt-2 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <span className="text-lg font-bold text-primary tabular-nums">
                                    {formatPrice(field.pricePerHour)}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                    / jam
                                </span>
                            </div>
                            {field.rating !== undefined && (
                                <div className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-md shrink-0">
                                    <Trophy className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-medium tabular-nums">
                                        {field.rating > 0
                                            ? field.rating.toFixed(1)
                                            : "Baru"}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                            <span>Sewa Lapangan</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
