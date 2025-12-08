"use client";
import { useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import {
    useGetAllSportTypes,
    useDeleteMultipleSportTypes,
} from "@/hooks/useSportTypes";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import CreateSportTypeButton from "./components/CreateSportTypeButton";
import { PaginationState } from "@tanstack/react-table";

export default function AdminSportTypesPage() {
    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });
    const { data, isLoading, isError } = useGetAllSportTypes(
        pageIndex + 1,
        pageSize
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleSportTypes();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Sport Types</h1>
                    <p className="text-muted-foreground">
                        Manage available sport types.
                    </p>
                </div>
                <CreateSportTypeButton />
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
