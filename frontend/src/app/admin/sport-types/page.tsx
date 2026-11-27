"use client";

import { Suspense } from "react";
import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import {
    useGetAllSportTypes,
    useDeleteMultipleSportTypes,
} from "@/hooks/useSportTypes";
import { useTableQueryState } from "@/hooks/useTableQueryState";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import CreateSportTypeButton from "./components/CreateSportTypeButton";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";

function AdminSportTypesContent() {
    const {
        pagination,
        setPagination,
        sorting,
        setSorting,
        searchInput,
        setSearchInput,
        debouncedSearch,
        resetAll,
    } = useTableQueryState();

    const { data, isLoading, isFetching, isError } = useGetAllSportTypes(
        pagination.pageIndex + 1,
        pagination.pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleSportTypes();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if ((isLoading && !data) || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Gagal memuat data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <AdminPageWrapper
            title="Cabang Olahraga"
            subtitle="Kelola daftar cabang olahraga yang tersedia."
            actions={<CreateSportTypeButton />}
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={pageCount}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onSearch={setSearchInput}
                        searchValue={searchInput}
                        searchPlaceholder="Cari nama cabang olahraga..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        onResetFilters={resetAll}
                        columnLabels={{ name: "Nama" }}
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}

/**
 * Admin Sport Types Page.
 */
export default function AdminSportTypesPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <AdminSportTypesContent />
        </Suspense>
    );
}
