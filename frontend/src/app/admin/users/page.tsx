"use client";

import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllUsers, useDeleteMultipleUsers } from "@/hooks/useUsers";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { CreateUserButton } from "./components/createUserButton";

export default function AdminUsersPage() {
    const { data: users, isLoading, isError } = useGetAllUsers();
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleUsers();

    const handleDeleteUsers = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;
        try {
            deleteMultiple(selectedIds);
        } catch (error) {
            console.error("Error deleting users:", error);
        }
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading data.</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-muted-foreground">
                        Total {users?.length || 0} users registered.
                    </p>
                </div>
                <CreateUserButton />
            </div>
            <DataTable
                columns={columns}
                data={users || []}
                onDeleteSelected={handleDeleteUsers}
            />
        </div>
    );
}
