"use client";

import { useGetAllFields, useDeleteMultipleFields } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/app/admin/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { renterAllFieldColumns } from "./columns";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";

export default function RenterFieldsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // This hook will now return filtered fields because the backend is updated
    const { data, isLoading, isError } = useGetAllFields(pageIndex + 1, pageSize);
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
                title="My Fields"
                description="View and manage all your fields across all venues."
            />
                    <DataTable
                        columns={renterAllFieldColumns}
                        data={data.data}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={data.meta.totalPages}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                    />
        </div>
    );
}
