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
import { useDeleteUser, useUpdateUser } from "@/hooks/useUsers";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { toast } from "sonner";
import { UserForm } from "./userForm";
import { UserFormValues } from "@/lib/schema/user.schema";

export type User = {
    id: string;
    fullName: string;
    email: string;
    role: "USER" | "RENTER" | "ADMIN";
    createdAt: string;
};

const ActionsCell = ({ user }: { user: User }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: deleteUser } = useDeleteUser();
    const { mutate: updateUser, isPending } = useUpdateUser();

    const handleDelete = async () => {
        deleteUser(user.id);
    };

    const handleEditSubmit = async (data: UserFormValues) => {
        updateUser(
            { userId: user.id, userData: data },
            {
                onSuccess: () => {
                    toast.success(`${user.fullName} updated successfully`);
                    setIsOpen(false);
                },
                onError: (error) => {
                    toast.error(
                        `Failed to update ${user.fullName} error: ${error.message}`
                    );
                },
            }
        );
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
                <UserForm
                    initialData={user}
                    onSubmit={handleEditSubmit}
                    isPending={isPending}
                />
            </DialogContent>
        </Dialog>
    );
};

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
        cell: ({ row }) => <ActionsCell user={row.original} />,
    },
];
