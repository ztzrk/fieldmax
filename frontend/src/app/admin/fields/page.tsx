"use client";

import { useGetAllFields, useDeleteMultipleFields } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "./components/columns";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";

/**
 * Admin Fields Page.
 * Displays a list of all fields in the system.
 * Allows filtering, bulk deletion, and detailed view.
 */
export default function AdminFieldsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useGetAllFields(
        pageIndex + 1,
        pageSize,
        search,
        undefined, // status
        undefined, // isClosed
        undefined, // sportTypeId
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleFields();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError || !data)
        return (
            <div className="flex items-center justify-center p-8 text-red-500">
                Failed to load fields.
            </div>
        );

    return (
        <AdminPageWrapper
            title="Manage Fields"
            subtitle="View and manage all fields in the system."
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data.data}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={data.meta.totalPages}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={setSearch}
                        searchValue={search}
                        sorting={sorting}
                        onSortingChange={setSorting}
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
