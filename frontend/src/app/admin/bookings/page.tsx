"use client";

import { formatPrice, formatDate, formatTime } from "@/lib/utils";
import { useGetBookings } from "@/hooks/useBookings";
import { Loader2, AlertCircle, Eye } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function AdminBookingsPage() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data: bookingsData, isLoading, isError } = useGetBookings(page, limit);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">Failed to load bookings</h2>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const bookings = bookingsData?.data || [];
    const meta = bookingsData?.meta;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "CONFIRMED":
            case "PAID":
                return "default"; // or a generic success variant if you have one, default is usually black/primary
            case "PENDING":
                return "secondary";
            case "CANCELLED":
            case "FAILED":
                return "destructive";
            case "COMPLETED":
                return "outline";
            default:
                return "secondary";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
                    <p className="text-muted-foreground">
                        Manage all venue reservations
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>
                        A list of all bookings across all venues.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Venue / Field</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookings.map((booking: any) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">
                                                {booking.id.substring(0, 8)}...
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {booking.user?.fullName || "N/A"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {booking.user?.email || "N/A"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {booking.field?.venue?.name || "Unknown"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {booking.field?.name || "Field"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>
                                                        {formatDate(booking.bookingDate)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(booking.paymentStatus)}>
                                                    {booking.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                Rp {booking.totalPrice.toLocaleString("id-ID")}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
