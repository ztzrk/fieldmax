"use client";

import { Suspense } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { DataTableFacetedFilter } from "@/components/shared/DataTableFacetedFilter";
import { columns } from "./components/column";
import { CreateVenueWizard } from "./components/CreateVenueWizard";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";
import { useGetAllVenues, useDeleteMultipleVenues } from "@/hooks/useVenues";
import { useTableQueryState } from "@/hooks/useTableQueryState";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
    VENUE_COLUMN_LABELS,
    VENUE_STATUS_OPTIONS,
} from "@/lib/table-filter-options";

const RENTER_VENUE_FILTER_KEYS = ["status"] as const;

function RenterVenuesContent() {
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
        filterKeys: RENTER_VENUE_FILTER_KEYS,
    });

    const { data, isLoading, isFetching, isError } = useGetAllVenues(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        filters.status
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleVenues();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if ((isLoading && !data) || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Gagal memuat data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;
    const chips = buildChips({
        status: { label: "Status", options: VENUE_STATUS_OPTIONS },
    });

    return (
        <AdminPageWrapper
            title="Tempat Olahraga Saya"
            subtitle="Kelola seluruh tempat olahraga dan lapangan Anda."
            actions={<CreateVenueWizard />}
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={(data?.data || []) as VenueResponseSchema[]}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onSearch={setSearchInput}
                        searchValue={searchInput}
                        searchPlaceholder="Cari nama, alamat, atau kota..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={hasActiveFilters}
                        activeFilterChips={chips}
                        onResetFilters={resetAll}
                        columnLabels={VENUE_COLUMN_LABELS}
                        filters={
                            <DataTableFacetedFilter
                                title="Status"
                                options={VENUE_STATUS_OPTIONS}
                                values={filters.status}
                                onChange={(vals) => setFilter("status", vals)}
                            />
                        }
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}

/**
 * Renter Venues Page.
 */
export default function RenterVenuesPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <RenterVenuesContent />
        </Suspense>
    );
}
