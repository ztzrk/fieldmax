"use client";

import { useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllUsers, useDeleteMultipleUsers } from "@/hooks/useUsers";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { CreateUserButton } from "./components/createUserButton";
import { PaginationState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Admin Users Page.
 * Displays a paginated list of all registered users.
 * Allows filtering by name/email and bulk deletion.
 */
export default function AdminUsersPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [search, setSearch] = useState("");

    const { data, isLoading, isError } = useGetAllUsers(
        pageIndex + 1,
        pageSize,
        search
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleUsers();

    const handleDeleteUsers = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;
        try {
            deleteMultiple(selectedIds);
        } catch (error) {}
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-muted-foreground">
                        Total {data?.meta?.total || 0} users registered.
                    </p>
                </div>
                <CreateUserButton />
            </div>
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        onDeleteSelected={handleDeleteUsers}
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={setSearch}
                        searchValue={search}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
