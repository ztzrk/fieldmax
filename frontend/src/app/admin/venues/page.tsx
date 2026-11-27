"use client";

import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/columns";
import { CreateVenueButton } from "./components/CreateVenueButton";
import {
    VenueQuerySchema,
    VenueResponseSchema,
} from "@/lib/schema/venue.schema";
import { useState } from "react";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useGetAllVenues, useDeleteMultipleVenues } from "@/hooks/useVenues";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const [status, setStatus] = useState<VenueQuerySchema["status"]>();
    const debouncedSearch = useDebounce(search, 400);

    const { data, isLoading, isFetching, isError } = useGetAllVenues(
        pageIndex + 1,
        pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        status
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleVenues();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    const handleSearch = (val: string) => {
        setSearch(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleResetFilters = () => {
        setSearch("");
        setStatus(undefined);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    if ((isLoading && !data) || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Gagal memuat data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <AdminPageWrapper
            title="Tempat Olahraga"
            subtitle="Kelola seluruh tempat olahraga di dalam sistem."
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
                        onSearch={handleSearch}
                        searchValue={search}
                        searchPlaceholder="Cari nama, alamat, kota, atau mitra..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={Boolean(status)}
                        onResetFilters={handleResetFilters}
                        filters={
                            <Select
                                value={status || "ALL"}
                                onValueChange={(val) => {
                                    setStatus(
                                        val === "ALL"
                                            ? undefined
                                            : (val as VenueQuerySchema["status"])
                                    );
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex: 0,
                                    }));
                                }}
                            >
                                <SelectTrigger className="h-9 w-[180px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="DRAFT">Draf</SelectItem>
                                    <SelectItem value="PENDING">
                                        Menunggu Verifikasi
                                    </SelectItem>
                                    <SelectItem value="APPROVED">
                                        Disetujui
                                    </SelectItem>
                                    <SelectItem value="REJECTED">
                                        Ditolak
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        }
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
