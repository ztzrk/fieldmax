import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * EmptyBookings Component
 *
 * Displays empty state when user has no bookings.
 */
export function EmptyBookings() {
    return (
        <Card className="text-center py-10">
            <CardContent className="flex flex-col items-center gap-4">
                <Calendar className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">
                    No bookings found
                </p>
                <Link href="/">
                    <Button>Book a Field</Button>
                </Link>
            </CardContent>
        </Card>
    );
}
