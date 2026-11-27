import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FieldBookingSidebarProps {
    pricePerHour: number;
    isClosed: boolean;
    isRoleRestricted?: boolean;
    onBook: () => void;
}

/**
 * FieldBookingSidebar Component
 *
 * Sticky sidebar with price and booking button for field detail page.
 */
export function FieldBookingSidebar({
    pricePerHour,
    isClosed,
    isRoleRestricted = false,
    onBook,
}: FieldBookingSidebarProps) {
    return (
        <div className="sticky top-24 space-y-6">
            <Card className="border-border/70 shadow-lg overflow-hidden rounded-2xl bg-card">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-500 to-amber-500" />
                <CardHeader className="bg-muted/30 pb-5 border-b border-border/60">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            Harga sewa
                        </p>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-bold tracking-tight text-primary tabular-nums">
                                {formatPrice(pricePerHour)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                / jam
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                    <div>
                        {isClosed ? (
                            <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-sm font-medium text-center border border-destructive/20">
                                Lapangan ini sedang ditutup sementara.
                            </div>
                        ) : (
                            <div className="p-3 bg-status-success/10 text-status-success rounded-xl text-sm font-medium text-center border border-status-success/25">
                                Tersedia untuk dipesan
                            </div>
                        )}
                    </div>

                    <Button
                        size="lg"
                        className="w-full text-base h-12 rounded-xl font-semibold shadow-md transition-all hover:shadow-lg"
                        onClick={onBook}
                        disabled={isClosed || isRoleRestricted}
                    >
                        {isClosed
                            ? "Tidak Tersedia"
                            : isRoleRestricted
                              ? "Khusus Akun Pengguna"
                              : "Pesan Sekarang"}
                        {!isClosed && !isRoleRestricted && (
                            <ArrowRight className="ml-2 h-5 w-5" />
                        )}
                    </Button>
                    {isRoleRestricted && !isClosed && (
                        <p className="text-xs text-center text-muted-foreground">
                            Pemesanan hanya dapat dilakukan menggunakan akun
                            Pengguna (User).
                        </p>
                    )}

                    <div className="pt-2 border-t border-border/60 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-status-success" />
                        <span>Pemesanan &amp; Pembayaran Aman</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
