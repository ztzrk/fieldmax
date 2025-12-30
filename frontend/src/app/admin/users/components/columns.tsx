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
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(user.id)}
                    >
                        Copy user ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                    </DialogTrigger>
                    <ConfirmationDialog
                        trigger={
                            <DropdownMenuItem
                                className="text-red-500"
                                onSelect={(e) => e.preventDefault()}
                            >
                                Delete User
                            </DropdownMenuItem>
                        }
                        title="Are you absolutely sure?"
                        description="This action cannot be undone. This will permanently delete the user account."
                        onConfirm={handleDelete}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <UserForm key={user.id} initialData={user} dialogClose={() => setIsOpen(false)} />
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
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
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
            return <div className="text-center">{pageIndex * pageSize + index + 1}</div>;
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
                Full Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "createdAt",
        header: "Joined At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="font-medium">
                    {date.toLocaleDateString("id-ID")}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell user={row.original} />
            </div>
        ),
    },
];
