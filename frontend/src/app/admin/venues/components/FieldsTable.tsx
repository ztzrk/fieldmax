"use client";
import { useState } from "react";
import { columns as fieldColumns } from "./columns-fields";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllFields } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { PaginationState } from "@tanstack/react-table";

export function AllFieldsTable() {
    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        });
    const { data, isLoading, isError } = useGetAllFields(
        pageIndex + 1,
        pageSize
    );

    if (isLoading) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading fields.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <DataTable
            columns={fieldColumns}
            data={data?.data || []}
            pageCount={pageCount}
            pagination={{ pageIndex, pageSize }}
            onPaginationChange={setPagination}
        />
    );
}
