"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useDeleteUser } from "@/hooks/useUsers";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { UserForm } from "./userForm";
import { StatusBadge, USER_ROLE_META } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

/**
 * User type definition matching the backend response.
 */
export type User = {
    id: string;
    fullName: string;
    email: string;
    role: "USER" | "RENTER" | "ADMIN";
    createdAt: string;
};

/**
 * Component for rendering action buttons (Copy ID, Edit, Delete) for a user row.
 */
const ActionsCell = ({ user }: { user: User }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: deleteUser } = useDeleteUser();

    const handleDelete = async () => {
        deleteUser(user.id);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu aksi</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(user.id)}
                    >
                        Salin ID pengguna
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Edit Pengguna</DropdownMenuItem>
                    </DialogTrigger>
                    <ConfirmationDialog
                        trigger={
                            <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                            >
                                Hapus Pengguna
                            </DropdownMenuItem>
                        }
                        title="Apakah Anda benar-benar yakin?"
                        description="Tindakan ini tidak dapat dibatalkan. Akun pengguna akan dihapus secara permanen."
                        onConfirm={handleDelete}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Pengguna</DialogTitle>
                </DialogHeader>
                <UserForm
                    key={user.id}
                    initialData={user}
                    dialogClose={() => setIsOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
};

/**
 * Column definitions for the Users table.
 * Includes formatting for roles and dates, and sorting options.
 */
export const columns: ColumnDef<User>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Pilih semua"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Pilih baris"
            />
        ),
        enableSorting: false,
    },
    {
        id: "index",
        header: () => <div className="text-center">#</div>,
        size: 50,
        cell: ({ row, table }) => {
            const index = row.index;
            const { pageIndex, pageSize } = table.getState().pagination;
            return (
                <div className="text-center">
                    {pageIndex * pageSize + index + 1}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Nama Lengkap
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Peran
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            const meta = USER_ROLE_META[role] ?? {
                label: role,
                tone: "neutral" as const,
            };
            return <StatusBadge label={meta.label} tone={meta.tone} />;
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Bergabung
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {formatDate(row.getValue("createdAt"))}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell user={row.original} />
            </div>
        ),
    },
];
