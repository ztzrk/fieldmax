"use client";

import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/columns";
import { CreateVenueButton } from "./components/CreateVenueButton";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";
import { useState } from "react";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useGetAllVenues, useDeleteMultipleVenues } from "@/hooks/useVenues";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Admin Venues Page.
 * Displays a list of all venues.
 */
export default function VenuesAndFieldsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError } = useGetAllVenues(
        pageIndex + 1,
        pageSize,
        debouncedSearch,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
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
            title="Venues"
            subtitle="Manage all venues in the system."
            actions={<CreateVenueButton />}
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
                        sorting={sorting}
                        onSortingChange={setSorting}
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
