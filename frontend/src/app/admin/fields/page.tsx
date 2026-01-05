"use client";

import { useGetAllFields, useDeleteMultipleFields } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/app/admin/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./components/columns";
import { PaginationState } from "@tanstack/react-table";
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
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useGetAllFields(
        pageIndex + 1,
        pageSize,
        search
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
        <div className="space-y-6">
            <PageHeader
                title="Manage Fields"
                description="View and manage all fields in the system."
            />
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
                    />
                </CardContent>
            </Card>
        </div>
    );
}
