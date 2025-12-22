"use client";
import { useState } from "react";
import { useGetAllVenues, useDeleteMultipleVenues } from "@/hooks/useVenues";
import { CreateVenueWizard } from "./components/CreateVenueWizard";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/column";
import { PaginationState } from "@tanstack/react-table";

export default function RenterVenuesPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, isLoading } = useGetAllVenues(pageIndex + 1, pageSize);
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleVenues();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if (isLoading || isDeleting) {
        return <FullScreenLoader />;
    }
    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">My Venues</h1>
                    <p className="text-muted-foreground">
                        Manage all your venues and their fields.
                    </p>
                </div>
                <CreateVenueWizard />
            </div>
            <DataTable
                columns={columns}
                data={data?.data || []}
                onDeleteSelected={handleDeleteSelected}
                pageCount={pageCount}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={setPagination}
            />
        </div>
    );
}
