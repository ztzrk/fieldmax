"use client";

import { Suspense } from "react";
import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import { DataTableFacetedFilter } from "@/components/shared/DataTableFacetedFilter";
import { useGetAllUsers, useDeleteMultipleUsers } from "@/hooks/useUsers";
import { useTableQueryState } from "@/hooks/useTableQueryState";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { CreateUserButton } from "./components/createUserButton";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import {
    USER_COLUMN_LABELS,
    USER_ROLE_OPTIONS,
    USER_VERIFIED_OPTIONS,
} from "@/lib/table-filter-options";

const USER_FILTER_KEYS = ["role", "isVerified"] as const;

function AdminUsersContent() {
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
        filterKeys: USER_FILTER_KEYS,
    });

    const { data, isLoading, isFetching, isError } = useGetAllUsers(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch || undefined,
        filters.role,
        filters.isVerified,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleUsers();

    const handleDeleteUsers = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;
        try {
            deleteMultiple(selectedIds);
        } catch (error) {}
    };

    if ((isLoading && !data) || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Gagal memuat data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;
    const chips = buildChips({
        role: { label: "Peran", options: USER_ROLE_OPTIONS },
        isVerified: { label: "Verifikasi", options: USER_VERIFIED_OPTIONS },
    });

    return (
        <AdminPageWrapper
            title="Pengguna"
            subtitle={`Total ${data?.meta?.total || 0} pengguna terdaftar.`}
            actions={<CreateUserButton />}
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        onDeleteSelected={handleDeleteUsers}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onSearch={setSearchInput}
                        searchValue={searchInput}
                        searchPlaceholder="Cari nama lengkap atau email..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={hasActiveFilters}
                        activeFilterChips={chips}
                        onResetFilters={resetAll}
                        columnLabels={USER_COLUMN_LABELS}
                        filters={
                            <>
                                <DataTableFacetedFilter
                                    title="Peran"
                                    options={USER_ROLE_OPTIONS}
                                    values={filters.role}
                                    onChange={(vals) => setFilter("role", vals)}
                                />
                                <DataTableFacetedFilter
                                    title="Verifikasi"
                                    options={USER_VERIFIED_OPTIONS}
                                    values={filters.isVerified}
                                    onChange={(vals) =>
                                        setFilter("isVerified", vals)
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
 * Admin Users Page.
 */
export default function AdminUsersPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <AdminUsersContent />
        </Suspense>
    );
}
