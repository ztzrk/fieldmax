"use client";

import { columns as fieldColumns } from "./columns-fields";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllFields } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export function AllFieldsTable() {
    const { data: fields, isLoading, isError } = useGetAllFields();

    if (isLoading) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading fields.</p>;

    return <DataTable columns={fieldColumns} data={fields || []} />;
}
