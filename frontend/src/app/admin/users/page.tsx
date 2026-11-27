"use client";

import { useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import { useGetAllUsers, useDeleteMultipleUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { CreateUserButton } from "./components/createUserButton";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";

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
    const [sorting, setSorting] = useState<SortingState>([]);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [role, setRole] = useState<"ADMIN" | "USER" | "RENTER" | undefined>(
        undefined
    );
    const [isVerified, setIsVerified] = useState<string | undefined>(undefined);

    const { data, isLoading, isFetching, isError } = useGetAllUsers(
        pageIndex + 1,
        pageSize,
        debouncedSearch || undefined,
        role,
        isVerified,
        sorting.length > 0 ? sorting[0].id : undefined,
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined
    );
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleUsers();

    const handleDeleteUsers = async (selectedIds: string[]) => {
        if (selectedIds.length === 0) return;
        try {
            deleteMultiple(selectedIds);
        } catch (error) {}
    };

    const handleSearch = (val: string) => {
        setSearch(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleResetFilters = () => {
        setSearch("");
        setRole(undefined);
        setIsVerified(undefined);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    if ((isLoading && !data) || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-destructive">Gagal memuat data.</p>;

    const pageCount = data?.meta?.totalPages ?? 0;

    return (
        <AdminPageWrapper
            title="Pengguna"
            subtitle={`Total ${data?.meta?.total || 0} pengguna terdaftar.`}
            actions={<CreateUserButton />}
        >
            <Card className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        onDeleteSelected={handleDeleteUsers}
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={handleSearch}
                        searchValue={search}
                        searchPlaceholder="Cari nama lengkap atau email..."
                        sorting={sorting}
                        onSortingChange={setSorting}
                        isFetching={isFetching && !isLoading}
                        hasActiveFilters={Boolean(role || isVerified)}
                        onResetFilters={handleResetFilters}
                        filters={
                            <>
                                <Select
                                    value={role || "ALL"}
                                    onValueChange={(val) => {
                                        setRole(
                                            val === "ALL"
                                                ? undefined
                                                : (val as any)
                                        );
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageIndex: 0,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[150px]">
                                        <SelectValue placeholder="Filter Peran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Peran
                                        </SelectItem>
                                        <SelectItem value="USER">
                                            Pengguna
                                        </SelectItem>
                                        <SelectItem value="RENTER">
                                            Mitra
                                        </SelectItem>
                                        <SelectItem value="ADMIN">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={isVerified || "ALL"}
                                    onValueChange={(val) => {
                                        setIsVerified(
                                            val === "ALL" ? undefined : val
                                        );
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageIndex: 0,
                                        }));
                                    }}
                                >
                                    <SelectTrigger className="h-9 w-[165px]">
                                        <SelectValue placeholder="Verifikasi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Semua</SelectItem>
                                        <SelectItem value="true">
                                            Terverifikasi
                                        </SelectItem>
                                        <SelectItem value="false">
                                            Belum Verifikasi
                                        </SelectItem>
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
