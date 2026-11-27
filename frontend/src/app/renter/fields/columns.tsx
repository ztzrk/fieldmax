"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "@/components/shared/DataTable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteField } from "@/hooks/useFields";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/utils";
import {
    APPROVAL_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";

/**
 * Component for rendering action buttons (Edit, Delete) for a field row.
 */
const ActionsCell = ({ field }: { field: FieldResponseSchema }) => {
    const { mutate: deleteField } = useDeleteField();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Buka menu aksi</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/renter/fields/${field.id}`}>
                        Edit Detail
                    </Link>
                </DropdownMenuItem>
                <ConfirmationDialog
                    trigger={
                        <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(e) => e.preventDefault()}
                        >
                            Hapus
                        </DropdownMenuItem>
                    }
                    title="Apakah Anda yakin?"
                    description={`Tindakan ini akan menghapus lapangan "${field.name}" secara permanen.`}
                    onConfirm={() => deleteField(field.id)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

/**
 * Column definitions for the Renter's "My Fields" table.
 * Includes checkboxes, index, status, price formatting, and actions.
 */
export const renterAllFieldColumns: ColumnDef<FieldResponseSchema>[] = [
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
        enableHiding: false,
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
        header: ({ column }) => (
            <SortableHeader column={column} title="Nama Lapangan" />
        ),
    },
    {
        accessorKey: "sportType.name",
        header: ({ column }) => (
            <SortableHeader column={column} title="Cabang Olahraga" />
        ),
    },
    {
        accessorKey: "venue.name",
        header: ({ column }) => (
            <SortableHeader column={column} title="Tempat Olahraga" />
        ),
    },
    {
        accessorKey: "pricePerHour",
        header: ({ column }) => (
            <SortableHeader
                column={column}
                title="Harga / Jam"
                align="right"
            />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("pricePerHour"));
            return (
                <div className="text-right font-medium tabular-nums">
                    {formatPrice(amount)}
                </div>
            );
        },
    },
    {
        accessorKey: "isClosed",
        header: ({ column }) => (
            <SortableHeader
                column={column}
                title="Ketersediaan"
                align="center"
            />
        ),
        cell: ({ row }) => {
            const isClosed = row.getValue("isClosed");
            return (
                <div className="flex justify-center">
                    <StatusBadge
                        label={isClosed ? "Tutup" : "Buka"}
                        tone={isClosed ? "destructive" : "success"}
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <SortableHeader column={column} title="Status" align="center" />
        ),
        size: 80,
        cell: ({ row }) => {
            const status = row.original.status;
            const meta = APPROVAL_STATUS_META[status] ?? {
                label: status,
                tone: "neutral" as const,
            };
            return (
                <div className="flex justify-center">
                    <StatusBadge label={meta.label} tone={meta.tone} />
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell field={row.original} />
            </div>
        ),
    },
];
