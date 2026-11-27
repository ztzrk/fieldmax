"use client";

import { useGetAllFields, useDeleteMultipleFields } from "@/hooks/useFields";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { useDebounce } from "@/hooks/useDebounce";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { renterAllFieldColumns } from "./columns";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useState } from "react";

/**
 * Renter Fields Page.
 * Displays a paginated list of all fields owned by the renter.
 * Allows filtering by name, status, availability, sport type, and bulk deletion.
 */
export default function RenterFieldsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">();
    const [isClosed, setIsClosed] = useState<boolean>();
    const [sportTypeId, setSportTypeId] = useState<string>();

    const { data: sportTypes } = useGetAllSportTypesWithoutPagination();
    const { data, isLoading, isFetching, isError } = useGetAllFields(
        pageIndex + 1,
        pageSize,
        debouncedSearch || undefined,
        status,
        isClosed,
        sportTypeId,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleFields();

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
        setIsClosed(undefined);
        setSportTypeId(undefined);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    if ((isLoading && !data) || isDeleting) return <FullScreenLoader />;
    if (isError || !data)
        return (
            <div className="flex items-center justify-center p-8 text-destructive font-medium">
                Gagal memuat data lapangan.
            </div>
        );

    return (
        <AdminPageWrapper
            title="Lapangan Saya"
            subtitle="Lihat dan kelola seluruh lapangan Anda di semua tempat olahraga."
        >
            <Card className="rounded-xl border-border/60 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={renterAllFieldColumns}
                        data={data.data}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={data.meta.totalPages}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={handleSearch}
                        searchValue={search}
                        searchPlaceholder="Cari nama lapangan atau tempat..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={Boolean(
                            status ||
                                isClosed !== undefined ||
                                sportTypeId
                        )}
                        onResetFilters={handleResetFilters}
                        filters={
                            <>
                                <Select
                                    value={status || "ALL"}
                                    onValueChange={(val) => {
                                        setStatus(
                                            val === "ALL"
                                                ? undefined
                                                : (val as
                                                      | "PENDING"
                                                      | "APPROVED"
                                                      | "REJECTED")
                                        );
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageIndex: 0,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[170px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Status
                                        </SelectItem>
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

                                <Select
                                    value={
                                        isClosed === undefined
                                            ? "ALL"
                                            : isClosed
                                            ? "true"
                                            : "false"
                                    }
                                    onValueChange={(val) => {
                                        setIsClosed(
                                            val === "ALL"
                                                ? undefined
                                                : val === "true"
                                        );
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageIndex: 0,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[160px]">
                                        <SelectValue placeholder="Ketersediaan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Kondisi
                                        </SelectItem>
                                        <SelectItem value="false">
                                            Buka
                                        </SelectItem>
                                        <SelectItem value="true">
                                            Tutup
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={sportTypeId || "ALL"}
                                    onValueChange={(val) => {
                                        setSportTypeId(
                                            val === "ALL" ? undefined : val
                                        );
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageIndex: 0,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[170px]">
                                        <SelectValue placeholder="Cabang Olahraga" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Olahraga
                                        </SelectItem>
                                        {sportTypes?.map((st) => (
                                            <SelectItem
                                                key={st.id}
                                                value={st.id}
                                            >
                                                {st.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>
                        }
                    />
                </CardContent>
            </Card>
        </AdminPageWrapper>
    );
}
