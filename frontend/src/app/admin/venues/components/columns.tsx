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
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import { useDeleteVenue } from "@/hooks/useVenues";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import Link from "next/link";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";
import { Checkbox } from "@/components/ui/checkbox";
import {
    APPROVAL_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";

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
                        <span className="sr-only">Buka menu aksi</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/venues/${venue.id}/edit`}>
                            Lihat & Edit Detail
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
                        description={`Tindakan ini akan menghapus venue "${venue.name}" secara permanen.`}
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
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Nama
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Alamat
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div
                className="max-w-[300px] truncate"
                title={row.getValue("address")}
            >
                {row.getValue("address")}
            </div>
        ),
    },
    {
        accessorKey: "district",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Kecamatan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "city",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Kota
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "renter.fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Mitra
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        ),
        size: 80,
        cell: ({ row }) => {
            const status = row.original.status;
            const rejectionReason = row.original.rejectionReason;
            const meta = APPROVAL_STATUS_META[status] ?? {
                label: status,
                tone: "neutral" as const,
            };
            return (
                <div
                    className="flex justify-center"
                    title={
                        status === "REJECTED" && rejectionReason
                            ? rejectionReason
                            : undefined
                    }
                >
                    <StatusBadge label={meta.label} tone={meta.tone} />
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        size: 80,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell venue={row.original} />
            </div>
        ),
    },
];
