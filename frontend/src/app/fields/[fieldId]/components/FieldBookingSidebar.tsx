import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FieldBookingSidebarProps {
    pricePerHour: number;
    isClosed: boolean;
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
    onBook,
}: FieldBookingSidebarProps) {
    return (
        <div className="sticky top-24 space-y-6">
            <Card className="border-border shadow-lg overflow-hidden rounded-xl">
                <CardHeader className="bg-muted/40 pb-6 border-b">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            Price per hour
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-primary">
                                {formatPrice(pricePerHour)}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        {isClosed ? (
                            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium text-center border border-destructive/20">
                                This field is currently closed.
                            </div>
                        ) : (
                            <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-sm font-medium text-center border border-green-500/20">
                                Available for booking
                            </div>
                        )}
                    </div>

                    <Button
                        size="lg"
                        className="w-full text-lg h-14 font-semibold shadow-md transition-all hover:shadow-lg"
                        onClick={onBook}
                        disabled={isClosed}
                    >
                        {isClosed ? "Unavailable" : "Book Now"}
                        {!isClosed && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>

                    <div className="pt-2 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <span>Secure Booking & Payment</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
