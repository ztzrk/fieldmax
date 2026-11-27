"use client";
import { useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllSportTypes, useDeleteMultipleSportTypes } from "@/hooks/useSportTypes";
import { useDebounce } from "@/hooks/useDebounce";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import CreateSportTypeButton from "./components/CreateSportTypeButton";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";

/**
 * Admin Sport Types Page.
 * Displays a list of available sport types.
 * Allows creation and deletion of sport types.
 */
export default function AdminSportTypesPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const { data, isLoading, isFetching, isError } = useGetAllSportTypes(
        pageIndex + 1,
        pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleSportTypes();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    const handleSearch = (val: string) => {
        setSearch(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={handleSearch}
                        searchValue={search}
                        searchPlaceholder="Cari nama cabang olahraga..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        onResetFilters={() => handleSearch("")}
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
