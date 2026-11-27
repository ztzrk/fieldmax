"use client";

import { useState } from "react";
import { useGetAllReports } from "@/hooks/useReports";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/columns";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    REPORT_CATEGORY_LABELS,
    REPORT_STATUS_LABELS,
} from "@/app/reports/constants";

export default function AdminReportsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");

    const { data, isLoading, isFetching, isError } = useGetAllReports(
        pageIndex + 1,
        pageSize,
        debouncedSearch || undefined,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
        statusFilter,
        categoryFilter
    );

    if (isLoading && !data) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Gagal memuat data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    const handleSearch = (val: string) => {
        setSearch(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleStatusChange = (val: string) => {
        setStatusFilter(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleCategoryChange = (val: string) => {
        setCategoryFilter(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setCategoryFilter("ALL");
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <AdminPageWrapper
            title="Kelola Laporan"
            subtitle="Tinjau dan selesaikan laporan pengguna."
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={handleSearch}
                        searchValue={search}
                        searchPlaceholder="Cari subjek, nama, atau email..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={
                            statusFilter !== "ALL" || categoryFilter !== "ALL"
                        }
                        onResetFilters={handleResetFilters}
                        filters={
                            <>
                                <Select
                                    value={statusFilter}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger className="h-9 w-[170px]">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Status
                                        </SelectItem>
                                        {(
                                            Object.keys(
                                                REPORT_STATUS_LABELS
                                            ) as Array<
                                                keyof typeof REPORT_STATUS_LABELS
                                            >
                                        ).map((key) => (
                                            <SelectItem key={key} value={key}>
                                                {REPORT_STATUS_LABELS[key]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={categoryFilter}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger className="h-9 w-[190px]">
                                        <SelectValue placeholder="Semua Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Kategori
                                        </SelectItem>
                                        {(
                                            Object.keys(
                                                REPORT_CATEGORY_LABELS
                                            ) as Array<
                                                keyof typeof REPORT_CATEGORY_LABELS
                                            >
                                        ).map((key) => (
                                            <SelectItem key={key} value={key}>
                                                {REPORT_CATEGORY_LABELS[key]}
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
