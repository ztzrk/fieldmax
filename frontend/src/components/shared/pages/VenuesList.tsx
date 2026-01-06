"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllVenues, useDeleteMultipleVenues } from "@/hooks/useVenues";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { PaginationState, ColumnDef } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";

interface VenuesListProps<TData> {
    title?: string;
    description?: string;
    columns: ColumnDef<TData>[];
    renderHeaderActions?: React.ReactNode;
}

export function VenuesList<TData extends VenueResponseSchema>({
    title,
    description,
    columns,
    renderHeaderActions,
}: VenuesListProps<TData>) {
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
        <div className="space-y-6">
            {(title || description || renderHeaderActions) && (
                <div className="flex justify-between items-center">
                    <div>
                        {title && (
                            <h1 className="text-3xl font-bold tracking-tight">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-muted-foreground mt-2">
                                {description}
                            </p>
                        )}
                    </div>
                    {renderHeaderActions && <div>{renderHeaderActions}</div>}
                </div>
            )}
            <DataTable
                columns={columns}
                data={(data?.data || []) as TData[]}
                onDeleteSelected={handleDeleteSelected}
                pageCount={pageCount}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={setPagination}
                onSearch={setSearch}
                searchValue={search}
            />
        </div>
    );
}
