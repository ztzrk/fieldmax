"use client";

import { useGetBookings } from "@/hooks/useBookings";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { PaginationState, ColumnDef } from "@tanstack/react-table";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";

interface BookingsListProps<TData> {
    title: string;
    description: string;
    columns: ColumnDef<TData>[];
}

export function BookingsList<TData extends BookingResponseSchema>({
    title,
    description,
    columns,
}: BookingsListProps<TData>) {
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

    const bookings = (bookingsData?.data || []) as TData[];
    const meta = bookingsData?.meta;
    const pageCount = meta?.totalPages ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {title}
                    </h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>

            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>
                        A list of all bookings across all venues.
                    </CardDescription>
                </CardHeader>
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
        </div>
    );
}
