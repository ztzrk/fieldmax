"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { SportTypeForm } from "./SportTypeForm";
import { useUpdateSportType, useDeleteSportType } from "@/hooks/useSportTypes";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
export type SportType = {
    id: string;
    name: string;
};

/**
 * Component for rendering action buttons (Edit, Delete) for a sport type row.
 */
const ActionsCell = ({ sportType }: { sportType: SportType }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { mutate: deleteSportType } = useDeleteSportType();
    const { mutate: updateSportType } = useUpdateSportType();

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DialogTrigger>
                    <ConfirmationDialog
                        trigger={
                            <DropdownMenuItem
                                className="text-red-500"
                                onSelect={(e) => e.preventDefault()}
                            >
                                Delete
                            </DropdownMenuItem>
                        }
                        title="Are you sure?"
                        description={`This will permanently delete the "${sportType.name}" sport type.`}
                        onConfirm={() => deleteSportType(sportType.id)}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Sport Type</DialogTitle>
                </DialogHeader>
                <SportTypeForm
                    initialData={{
                        name: sportType.name,
                    }}
                    onSubmit={async (data) =>
                        updateSportType(
                            { id: sportType.id, data },
                            { onSuccess: () => setIsEditDialogOpen(false) }
                        )
                    }
                    isPending={false}
                />
            </DialogContent>
        </Dialog>
    );
};

/**
 * Column definitions for the Sport Types table.
 * Includes checkboxes, name, and actions.
 */
export const columns: ColumnDef<SportType>[] = [
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
        size: 40,
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
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="p-0 hover:bg-transparent"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="font-medium capitalize pl-0">
                    {row.getValue("name")}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        size: 80,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell sportType={row.original} />
            </div>
        ),
    },
];
