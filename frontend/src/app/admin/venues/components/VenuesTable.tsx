"use client";
import { useState } from "react";
import { columns } from "./columns-venues";
import { DataTable } from "@/components/shared/DataTable";
import { useDeleteMultipleVenues, useGetAllVenues } from "@/hooks/useVenues";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { CreateVenueButton } from "./CreateVenueButton";
import { PaginationState } from "@tanstack/react-table";

export function VenuesTable() {
    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useGetAllVenues(
        pageIndex + 1,
        pageSize,
        search
    );
    const { mutate: deleteMultiple } = useDeleteMultipleVenues();

    const handleDeleteVenues = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;
        deleteMultiple(selectedIds);
    };

    if (isLoading) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <CreateVenueButton />
            </div>
            <DataTable
                columns={columns}
                data={data?.data || []}
                onDeleteSelected={handleDeleteVenues}
                pageCount={pageCount}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={setPagination}
                onSearch={setSearch}
                searchValue={search}
            />
        </div>
    );
}
