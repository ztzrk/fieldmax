"use client";

import { Suspense, useMemo } from "react";
import { useGetAllReports } from "@/hooks/useReports";
import { useTableQueryState } from "@/hooks/useTableQueryState";
import { DataTable } from "@/components/shared/DataTable";
import { DataTableFacetedFilter } from "@/components/shared/DataTableFacetedFilter";
import { columns } from "./components/columns";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import {
    REPORT_CATEGORY_LABELS,
    REPORT_STATUS_LABELS,
} from "@/app/reports/constants";
import { REPORT_COLUMN_LABELS } from "@/lib/table-filter-options";

const REPORT_FILTER_KEYS = ["status", "category"] as const;

function AdminReportsContent() {
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
        filterKeys: REPORT_FILTER_KEYS,
    });

    const statusOptions = useMemo(
        () =>
            (
                Object.keys(REPORT_STATUS_LABELS) as Array<
                    keyof typeof REPORT_STATUS_LABELS
                >
            ).map((key) => ({ value: key, label: REPORT_STATUS_LABELS[key] })),
        []
    );
    const categoryOptions = useMemo(
        () =>
            (
                Object.keys(REPORT_CATEGORY_LABELS) as Array<
                    keyof typeof REPORT_CATEGORY_LABELS
                >
            ).map((key) => ({
                value: key,
                label: REPORT_CATEGORY_LABELS[key],
            })),
        []
    );

    const { data, isLoading, isFetching, isError } = useGetAllReports(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        filters.status,
        filters.category
    );

    if (isLoading && !data) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Gagal memuat data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;
    const chips = buildChips({
        status: { label: "Status", options: statusOptions },
        category: { label: "Kategori", options: categoryOptions },
    });

    return (
        <AdminPageWrapper
            title="Kelola Laporan"
            subtitle="Tinjau dan selesaikan laporan pengguna."
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onSearch={setSearchInput}
                        searchValue={searchInput}
                        searchPlaceholder="Cari subjek, nama, atau email..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={hasActiveFilters}
                        activeFilterChips={chips}
                        onResetFilters={resetAll}
                        columnLabels={REPORT_COLUMN_LABELS}
                        filters={
                            <>
                                <DataTableFacetedFilter
                                    title="Status"
                                    options={statusOptions}
                                    values={filters.status}
                                    onChange={(vals) =>
                                        setFilter("status", vals)
                                    }
                                />
                                <DataTableFacetedFilter
                                    title="Kategori"
                                    options={categoryOptions}
                                    values={filters.category}
                                    onChange={(vals) =>
                                        setFilter("category", vals)
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

export default function AdminReportsPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <AdminReportsContent />
        </Suspense>
    );
}
