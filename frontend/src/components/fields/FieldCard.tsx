"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { formatPrice } from "@/lib/utils";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import Link from "next/link";

interface FieldCardProps {
    field: FieldResponseSchema;
}

export function FieldCard({ field }: FieldCardProps) {
    return (
        <Link href={`/fields/${field.id}`} className="block h-full">
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-muted-foreground/10 cursor-pointer h-full flex flex-col p-0">
                <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
                    {field.photos && field.photos.length > 0 ? (
                        <img
                            src={field.photos[0].url}
                            alt={field.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <ImagePlaceholder
                            variant="pattern"
                            icon={<Trophy className="h-8 w-8 opacity-20" />}
                        />
                    )}
                    <div className="absolute top-2 right-2">
                        <Badge className="bg-background/90 text-foreground hover:bg-background shadow-sm backdrop-blur-sm">
                            {field.sportType?.name || "Sport"}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {field.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">
                            {field.venue?.name}
                        </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3 border-t">
                        <div>
                            <span className="text-lg font-bold text-primary">
                                {formatPrice(field.pricePerHour)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                                / hour
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
