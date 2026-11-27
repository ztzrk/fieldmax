"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { SortableHeader } from "@/components/shared/DataTable";
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
    isVerified?: boolean;
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
            <SortableHeader column={column} title="Nama Lengkap" />
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <SortableHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <SortableHeader column={column} title="Peran" />
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
        accessorKey: "isVerified",
        header: ({ column }) => (
            <SortableHeader
                column={column}
                title="Verifikasi"
                align="center"
            />
        ),
        cell: ({ row }) => {
            const isVerified = Boolean(row.original.isVerified);
            return (
                <div className="flex justify-center">
                    <StatusBadge
                        label={isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                        tone={isVerified ? "success" : "warning"}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <SortableHeader column={column} title="Bergabung" />
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
