"use client";

import { columns } from "./components/columns";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useGetBookings } from "@/hooks/useBookings";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";

/**
 * Admin Bookings Page.
 * Displays a list of all bookings across all venues.
 * Included details: User, Venue/Field, Date & Time, Status, and Payment info.
 */
export default function AdminBookingsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    // API uses 1-based page index
    const {
        data: bookingsData,
        isLoading,
        isError,
    } = useGetBookings(
        pageIndex + 1,
        pageSize,
        search,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );

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
            title="Bookings"
            subtitle="Manage all venue reservations"
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
                        sorting={sorting}
                        onSortingChange={setSorting}
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
