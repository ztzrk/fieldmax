"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Trophy, ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { formatPrice } from "@/lib/utils";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import Link from "next/link";

interface FieldCardProps {
    field: FieldResponseSchema;
}

export function FieldCard({ field }: FieldCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            href={`/fields/${field.id}`}
            className="block h-full cursor-pointer group"
        >
            <Card className="h-full flex flex-col p-0 overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                    {field.photos && field.photos.length > 0 && !imageError ? (
                        <img
                            src={field.photos[0].url}
                            alt={field.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                            {field.sportType?.name || "Sport"}
                        </Badge>
                    </div>

                    {/* Status Indicator */}
                    {!field.isClosed && (
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:bg-white animate-pulse" />
                            Available
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

                    <div className="mt-auto h-12 relative overflow-hidden">
                        {/* Default State: Price and Rating */}
                        <div className="absolute inset-0 flex items-center justify-between transition-transform duration-300 group-hover:-translate-y-full">
                            <div>
                                <span className="text-xl font-bold text-primary">
                                    {formatPrice(field.pricePerHour)}
                                </span>
                                <span className="text-xs text-muted-foreground ml-1">
                                    / hour
                                </span>
                            </div>
                            {field.rating !== undefined && (
                                <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                                    <Trophy className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-medium">
                                        {field.rating > 0
                                            ? field.rating.toFixed(1)
                                            : "New"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Hover State: Book Button */}
                        <div className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <Button className="w-full font-semibold shadow-md gap-2">
                                Book This Field
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
