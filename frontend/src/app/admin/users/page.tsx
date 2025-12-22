"use client";

import { useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllUsers, useDeleteMultipleUsers } from "@/hooks/useUsers";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { CreateUserButton } from "./components/createUserButton";
import { PaginationState } from "@tanstack/react-table";

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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-muted-foreground">
                        Total {data?.meta?.total || 0} users registered.
                    </p>
                </div>
                <CreateUserButton />
            </div>
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
        </div>
    );
}
