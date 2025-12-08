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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FieldApiResponse } from "@/lib/schema/field.schema";
import { useDeleteField } from "@/hooks/useFields";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import Link from "next/link";

const ActionsCell = ({ field }: { field: FieldApiResponse }) => {
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
                    <Link href={`/admin/fields/${field.id}`}>Edit Field</Link>
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

export const columns: ColumnDef<FieldApiResponse>[] = [
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
    },
    {
        accessorKey: "name",
        header: "Field Name",
    },
    {
        accessorKey: "sportType.name",
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
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "venue.name",
        header: "Venue",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={status === "APPROVED" ? "default" : "secondary"}
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell field={row.original} />,
    },
];
