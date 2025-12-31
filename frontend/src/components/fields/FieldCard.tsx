"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Trophy, ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import { useAuth } from "@/context/AuthContext";

interface FieldCardProps {
    field: FieldResponseSchema;
}

export function FieldCard({ field }: FieldCardProps) {
    const router = useRouter();
    const { user } = useAuth();

    const handleBookClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            window.location.href = "/login";
            return;
        }

        if (user.role !== "USER") {
            toast.error("Booking is restricted to Users only.");
            return;
        }

        router.push(`/fields/${field.id}`);
    };

    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group h-full flex flex-col"
            onClick={() => router.push(`/fields/${field.id}`)}
        >
            <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                {field.photos && field.photos.length > 0 ? (
                    <img
                        src={field.photos[0].url}
                        alt={field.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                ) : (
                    <ImagePlaceholder
                        variant="pattern"
                        icon={<Trophy className="h-8 w-8 opacity-20" />}
                    />
                )}
            </div>
            <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-start">
                    <div className="w-full">
                        <Badge
                            variant="outline"
                            className="mb-1 text-[10px] px-1.5 py-0 h-4"
                        >
                            {field.sportType.name}
                        </Badge>
                        <CardTitle
                            className="line-clamp-1 text-sm font-semibold"
                            title={field.name}
                        >
                            {field.name}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-2 flex-col flex flex-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">{field.venue.name}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold">
                        {formatPrice(field.pricePerHour)}/hr
                    </span>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 px-2 text-xs gap-1 hover:bg-primary hover:text-primary-foreground"
                        onClick={handleBookClick}
                    >
                        Book <ArrowRight className="h-2.5 w-2.5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
