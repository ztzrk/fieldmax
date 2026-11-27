"use client";

import { Suspense } from "react";
import { columns } from "./components/columns";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import { useGetBookings } from "@/hooks/useBookings";
import { useTableQueryState } from "@/hooks/useTableQueryState";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/shared/DataTable";
import { DataTableFacetedFilter } from "@/components/shared/DataTableFacetedFilter";
import { CheckInScannerDialog } from "./components/CheckInScannerDialog";
import {
    BOOKING_COLUMN_LABELS,
    BOOKING_STATUS_OPTIONS,
    PAYMENT_STATUS_OPTIONS,
} from "@/lib/table-filter-options";

const RENTER_BOOKING_FILTER_KEYS = ["status", "paymentStatus"] as const;

function RenterBookingsContent() {
    const {
        pagination,
        setPagination,
        sorting,
        setSorting,
        searchInput,
        setSearchInput,
        debouncedSearch,
        filters,
        setFilter,
        resetAll,
        hasActiveFilters,
        buildChips,
    } = useTableQueryState({
        filterKeys: RENTER_BOOKING_FILTER_KEYS,
    });

    const {
        data: bookingsData,
        isLoading,
        isFetching,
        isError,
    } = useGetBookings(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        filters.status,
        filters.paymentStatus
    );

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
    const pageCount = bookingsData?.meta?.totalPages ?? 0;

    const chips = buildChips({
        status: { label: "Status", options: BOOKING_STATUS_OPTIONS },
        paymentStatus: {
            label: "Pembayaran",
            options: PAYMENT_STATUS_OPTIONS,
        },
    });

    return (
        <AdminPageWrapper
            title="Manajemen Pemesanan"
            subtitle="Lihat dan kelola pemesanan untuk tempat olahraga Anda"
            actions={<CheckInScannerDialog />}
        >
            <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={bookings}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onSearch={setSearchInput}
                        searchValue={searchInput}
                        searchPlaceholder="Cari ID, pelanggan, atau lapangan..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={hasActiveFilters}
                        activeFilterChips={chips}
                        onResetFilters={resetAll}
                        columnLabels={BOOKING_COLUMN_LABELS}
                        filters={
                            <>
                                <DataTableFacetedFilter
                                    title="Status"
                                    options={BOOKING_STATUS_OPTIONS}
                                    values={filters.status}
                                    onChange={(vals) =>
                                        setFilter("status", vals)
                                    }
                                />
                                <DataTableFacetedFilter
                                    title="Pembayaran"
                                    options={PAYMENT_STATUS_OPTIONS}
                                    values={filters.paymentStatus}
                                    onChange={(vals) =>
                                        setFilter("paymentStatus", vals)
                                    }
                                />
                            </>
                        }
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}

/**
 * Renter Bookings Page.
 */
export default function RenterBookingsPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <RenterBookingsContent />
        </Suspense>
    );
}
