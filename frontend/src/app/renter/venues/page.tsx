"use client";

import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/column";
import { CreateVenueWizard } from "./components/CreateVenueWizard";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { useGetAllVenues, useDeleteMultipleVenues } from "@/hooks/useVenues";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Renter Venues Page.
 * Displays a list of venues owned by the renter.
 */
export default function RenterVenuesPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useGetAllVenues(
        pageIndex + 1,
        pageSize,
        debouncedSearch
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleVenues();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Error loading data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <AdminPageWrapper
            title="My Venues"
            subtitle="Manage all your venues and their fields."
            actions={<CreateVenueWizard />}
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={(data?.data || []) as VenueResponseSchema[]}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={pageCount}
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
