"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Booking {
    id: string;
    createdAt: string;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    user: {
        fullName: string;
        email: string;
    };
    field: {
        name: string;
        venue: {
            name: string;
        };
    };
}

interface RecentBookingsProps {
    bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Pemesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pengguna</TableHead>
                                <TableHead>Tempat Olahraga / Lapangan</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings && bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {booking.user.fullName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {booking.user.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {booking.field.venue.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {booking.field.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(booking.totalPrice)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    booking.paymentStatus ===
                                                    "PAID"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {booking.paymentStatus}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center h-24 text-muted-foreground"
                                    >
                                        Belum ada pemesanan terbaru.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
