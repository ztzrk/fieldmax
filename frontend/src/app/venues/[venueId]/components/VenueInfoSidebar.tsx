import { MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface VenueInfoSidebarProps {
    name: string;
    address: string;
    city?: string;
    province?: string;
    postalCode?: string;
}

/**
 * VenueInfoSidebar Component
 *
 * Sticky sidebar with venue information and directions link.
 */
export function VenueInfoSidebar({
    name,
    address,
    city,
    province,
    postalCode,
}: VenueInfoSidebarProps) {
    return (
        <div className="sticky top-24 space-y-6">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm ring-1 ring-border/50">
                <CardHeader className="uppercase text-xs font-bold text-muted-foreground tracking-wider pb-2">
                    Venue Information
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-sm block">
                                    Address
                                </span>
                                <p className="text-sm text-muted-foreground leading-snug">
                                    {address}
                                    <br />
                                    {city}, {province} {postalCode}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        `${name} ${address}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-1"
                                >
                                    Get Directions{" "}
                                    <ArrowRight className="h-3 w-3" />
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-sm block">
                                    Verified Venue
                                </span>
                                <p className="text-sm text-muted-foreground leading-snug">
                                    FieldMax has verified this venue listing for
                                    accuracy.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="pt-2">
                        <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
                            Have questions? Contact the venue directly upon
                            booking confirmation.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
