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
import { Badge } from "@/components/ui/badge";
import { useDeleteField } from "@/hooks/useFields";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { fieldNestedApiResponse } from "@/lib/schema/venue.schema";
import Link from "next/link";

/**
 * Component for rendering action buttons (Edit, Delete) for a field row within a venue.
 */
const ActionsCell = ({
    field,
    venueId,
}: {
    field: fieldNestedApiResponse;
    venueId: string;
}) => {
    const { mutate: deleteField } = useDeleteField();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link
                        href={`/renter/fields/${field.id}?fromVenue=${venueId}`}
                    >
                        Edit Details
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
                    description={`This will permanently delete the "${field.name}" field.`}
                    onConfirm={() => deleteField(field.id)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

import { Checkbox } from "@/components/ui/checkbox";

/**
 * Column definitions for the "Fields in this Venue" table.
 * Includes checkboxes, name, sport type, price, status, and actions.
 */
export const getRenterFieldColumns = (
    venueId: string
): ColumnDef<fieldNestedApiResponse>[] => [
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
        accessorKey: "name",
        header: "Field Name",
    },
    {
        accessorKey: "sportTypeName",
        header: "Sport Type",
    },
    {
        accessorKey: "pricePerHour",
        header: "Price / Hour",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("pricePerHour"));
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        size: 80,
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <div className="flex justify-center">
                    <Badge
                        variant={status === "APPROVED" ? "default" : "secondary"}
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
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell field={row.original} venueId={venueId} />
            </div>
        ),
    },
];