import Link from "next/link";
import { Calendar, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyBookings() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-muted-foreground/10 rounded-xl bg-muted/5">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Ticket className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
                You haven't made any bookings. Find your perfect field and start
                playing today!
            </p>
            <Link href="/fields">
                <Button
                    size="lg"
                    className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                    Find a Field
                </Button>
            </Link>
        </div>
    );
}
