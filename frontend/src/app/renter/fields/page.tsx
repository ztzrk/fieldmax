"use client";

import { useGetAllFields, useDeleteMultipleFields } from "@/hooks/useFields";
import { useDebounce } from "@/hooks/useDebounce";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { renterAllFieldColumns } from "./columns";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

/**
 * Renter Fields Page.
 * Displays a paginated list of all fields owned by the renter.
 * Allows filtering by name and bulk deletion.
 */
export default function RenterFieldsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useGetAllFields(
        pageIndex + 1,
        pageSize,
        debouncedSearch
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleFields();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError || !data)
        return (
            <div className="flex items-center justify-center p-8 text-destructive font-medium">
                Gagal memuat data lapangan.
            </div>
        );

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
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={setSearch}
                        searchValue={search}
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
