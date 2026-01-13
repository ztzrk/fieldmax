"use client";

import { useState } from "react";
import { useGetAllReports } from "@/hooks/useReports";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/columns";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export default function AdminReportsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useGetAllReports(
        pageIndex + 1,
        pageSize,
        search,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );

    if (isLoading) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <AdminPageWrapper
            title="Manage Reports"
            subtitle="View and resolve user reports."
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
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
