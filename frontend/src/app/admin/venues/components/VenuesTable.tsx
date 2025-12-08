"use client";

import { columns } from "./columns-venues";
import { DataTable } from "@/components/shared/DataTable";
import { useDeleteMultipleVenues, useGetAllVenues } from "@/hooks/useVenues";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { CreateVenueButton } from "./CreateVenueButton";

export function VenuesTable() {
    const { data: venues, isLoading, isError } = useGetAllVenues();
    const { mutate: deleteMultiple } = useDeleteMultipleVenues();

    const handleDeleteVenues = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;
        deleteMultiple(selectedIds);
    };

    if (isLoading) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading data.</p>;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <CreateVenueButton />
            </div>
            <DataTable
                columns={columns}
                data={venues || []}
                onDeleteSelected={handleDeleteVenues}
            />
        </div>
    );
}
