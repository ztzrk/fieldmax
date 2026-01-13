"use client";

import { columns } from "./components/columns";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useGetBookings } from "@/hooks/useBookings";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";

/**
 * Renter Bookings Page.
 * Displays a list of bookings for the renter's filtered view (handled by backend usually).
 */
export default function RenterBookingsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [search, setSearch] = useState("");

    // API uses 1-based page index
    const {
        data: bookingsData,
        isLoading,
        isError,
    } = useGetBookings(pageIndex + 1, pageSize, search);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">
                    Failed to load bookings
                </h2>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const bookings = (bookingsData?.data || []) as BookingResponseSchema[];
    const meta = bookingsData?.meta;
    const pageCount = meta?.totalPages ?? 0;

    return (
        <AdminPageWrapper
            title="Bookings Management"
            subtitle="View and manage bookings for your venues"
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={bookings}
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={setSearch}
                        searchValue={search}
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
