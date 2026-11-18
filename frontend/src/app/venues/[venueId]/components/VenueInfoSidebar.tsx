import { MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface VenueInfoSidebarProps {
    name: string;
    address: string;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
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
            <Card className="rounded-2xl border-border/70 shadow-lg overflow-hidden bg-card">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-500 to-amber-500" />
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold">
                        Informasi Tempat Olahraga
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3.5">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <span className="font-semibold text-sm block">
                                    Alamat
                                </span>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {address}
                                    {(city || province || postalCode) && (
                                        <>
                                            <br />
                                            {[city, province, postalCode]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full gap-2 rounded-xl"
                        >
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${name} ${address}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MapPin className="h-4 w-4 text-primary" />
                                Petunjuk Arah di Google Maps
                                <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground" />
                            </a>
                        </Button>

                        <div className="flex items-start gap-3.5 pt-1">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div className="space-y-0.5">
                                <span className="font-semibold text-sm block">
                                    Tempat Terverifikasi
                                </span>
                                <p className="text-sm text-muted-foreground">
                                    Terdata resmi di FieldMax.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <p className="text-xs text-center text-muted-foreground leading-relaxed">
                        Kontak pengelola tersedia setelah pemesanan
                        dikonfirmasi.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
