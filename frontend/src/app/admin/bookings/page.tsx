"use client";

import { columns } from "./components/columns";
import {
    BookingQuerySchema,
    BookingResponseSchema,
} from "@/lib/schema/booking.schema";
import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useGetBookings } from "@/hooks/useBookings";
import { useDebounce } from "@/hooks/useDebounce";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const debouncedSearch = useDebounce(search, 400);
    const [status, setStatus] = useState<BookingQuerySchema["status"]>();
    const [paymentStatus, setPaymentStatus] =
        useState<BookingQuerySchema["paymentStatus"]>();

    // API uses 1-based page index
    const {
        data: bookingsData,
        isLoading,
        isFetching,
        isError,
    } = useGetBookings(
        pageIndex + 1,
        pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        status,
        paymentStatus
    );

    const handleSearch = (val: string) => {
        setSearch(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleResetFilters = () => {
        setSearch("");
        setStatus(undefined);
        setPaymentStatus(undefined);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    if (isLoading && !bookingsData) {
        return <FullScreenLoader />;
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
                <h2 className="text-xl font-semibold">
                    Gagal memuat pemesanan
                </h2>
                <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </div>
        );
    }

    const bookings = (bookingsData?.data || []) as BookingResponseSchema[];
    const meta = bookingsData?.meta;
    const pageCount = meta?.totalPages ?? 0;

    return (
        <AdminPageWrapper
            title="Pemesanan"
            subtitle="Kelola seluruh reservasi venue"
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={bookings}
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={handleSearch}
                        searchValue={search}
                        searchPlaceholder="Cari ID, pelanggan, atau lapangan..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={Boolean(status || paymentStatus)}
                        onResetFilters={handleResetFilters}
                        filters={
                            <>
                                <Select
                                    value={status || "ALL"}
                                    onValueChange={(val) => {
                                        setStatus(
                                            val === "ALL"
                                                ? undefined
                                                : (val as BookingQuerySchema["status"])
                                        );
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageIndex: 0,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[170px]">
                                        <SelectValue placeholder="Status Pesanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            Menunggu
                                        </SelectItem>
                                        <SelectItem value="CONFIRMED">
                                            Dikonfirmasi
                                        </SelectItem>
                                        <SelectItem value="COMPLETED">
                                            Selesai
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                            Dibatalkan
                                        </SelectItem>
                                        <SelectItem value="NO_SHOW">
                                            Tidak Hadir
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={paymentStatus || "ALL"}
                                    onValueChange={(val) => {
                                        setPaymentStatus(
                                            val === "ALL"
                                                ? undefined
                                                : (val as BookingQuerySchema["paymentStatus"])
                                        );
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageIndex: 0,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[180px]">
                                        <SelectValue placeholder="Pembayaran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Pembayaran
                                        </SelectItem>
                                        <SelectItem value="PAID">Lunas</SelectItem>
                                        <SelectItem value="PENDING">
                                            Menunggu Pembayaran
                                        </SelectItem>
                                        <SelectItem value="EXPIRED">
                                            Kedaluwarsa
                                        </SelectItem>
                                        <SelectItem value="FAILED">
                                            Gagal
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </>
                        }
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
