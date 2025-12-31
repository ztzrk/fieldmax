"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { useDeleteVenue } from "@/hooks/useVenues";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Component for rendering action buttons (View/Edit Details, Delete) for a venue row.
 */
const ActionsCell = ({ venue }: { venue: VenueResponseSchema }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { mutate: deleteVenue } = useDeleteVenue();

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
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/venues/${venue.id}/edit`}>
                            View & Edit Details
                        </Link>
                    </DropdownMenuItem>

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
                        description={`This will permanently delete the "${venue.name}" venue.`}
                        onConfirm={() => deleteVenue(venue.id)}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
    );
};

/**
 * Column definitions for the Venues table.
 * Includes checkboxes, index, name, address, renter, status, and actions.
 */
export const columns: ColumnDef<VenueResponseSchema>[] = [
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
    { accessorKey: "name", header: "Name" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "renter.fullName", header: "Renter" },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        size: 80,
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <div className="flex justify-center">
                    <Badge
                        variant={
                            status === "APPROVED"
                                ? "default"
                                : status === "REJECTED"
                                ? "destructive"
                                : "secondary"
                        }
                    >
                        {status}
                    </Badge>
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
                <ActionsCell venue={row.original} />
            </div>
        ),
    },
];
