"use client";

import { Suspense, useMemo } from "react";
import { useGetAllFields, useDeleteMultipleFields } from "@/hooks/useFields";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { useTableQueryState } from "@/hooks/useTableQueryState";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { DataTableFacetedFilter } from "@/components/shared/DataTableFacetedFilter";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { renterAllFieldColumns } from "./columns";
import {
    AVAILABILITY_OPTIONS,
    FIELD_COLUMN_LABELS,
    FIELD_STATUS_OPTIONS,
} from "@/lib/table-filter-options";

const RENTER_FIELD_FILTER_KEYS = ["status", "isClosed", "sportTypeId"] as const;

function RenterFieldsContent() {
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
        filterKeys: RENTER_FIELD_FILTER_KEYS,
    });

    const { data: sportTypes } = useGetAllSportTypesWithoutPagination();
    const sportOptions = useMemo(
        () => (sportTypes || []).map((st) => ({ value: st.id, label: st.name })),
        [sportTypes]
    );

    const { data, isLoading, isFetching, isError } = useGetAllFields(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch || undefined,
        filters.status,
        filters.isClosed,
        filters.sportTypeId,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleFields();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if ((isLoading && !data) || isDeleting) return <FullScreenLoader />;
    if (isError || !data)
        return (
            <div className="flex items-center justify-center p-8 text-destructive font-medium">
                Gagal memuat data lapangan.
            </div>
        );

    const chips = buildChips({
        status: { label: "Status", options: FIELD_STATUS_OPTIONS },
        isClosed: { label: "Ketersediaan", options: AVAILABILITY_OPTIONS },
        sportTypeId: { label: "Olahraga", options: sportOptions },
    });

    return (
        <AdminPageWrapper
            title="Lapangan Saya"
            subtitle="Lihat dan kelola seluruh lapangan Anda di semua tempat olahraga."
        >
            <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={renterAllFieldColumns}
                        data={data.data}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={data.meta.totalPages}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onSearch={setSearchInput}
                        searchValue={searchInput}
                        searchPlaceholder="Cari nama lapangan atau tempat..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={hasActiveFilters}
                        activeFilterChips={chips}
                        onResetFilters={resetAll}
                        columnLabels={FIELD_COLUMN_LABELS}
                        filters={
                            <>
                                <DataTableFacetedFilter
                                    title="Status"
                                    options={FIELD_STATUS_OPTIONS}
                                    values={filters.status}
                                    onChange={(vals) =>
                                        setFilter("status", vals)
                                    }
                                />
                                <DataTableFacetedFilter
                                    title="Ketersediaan"
                                    options={AVAILABILITY_OPTIONS}
                                    values={filters.isClosed}
                                    onChange={(vals) =>
                                        setFilter("isClosed", vals)
                                    }
                                />
                                <DataTableFacetedFilter
                                    title="Olahraga"
                                    options={sportOptions}
                                    values={filters.sportTypeId}
                                    onChange={(vals) =>
                                        setFilter("sportTypeId", vals)
                                    }
                                    searchable
                                    searchPlaceholder="Cari cabang olahraga..."
                                    emptyText="Olahraga tidak ditemukan."
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
 * Renter Fields Page.
 */
export default function RenterFieldsPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <RenterFieldsContent />
        </Suspense>
    );
}
