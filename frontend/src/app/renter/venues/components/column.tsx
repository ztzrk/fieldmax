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
import { useDeleteVenue, useResubmitVenue } from "@/hooks/useVenues";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { VenueApiResponse } from "@/lib/schema/venue.schema";
import { Checkbox } from "@/components/ui/checkbox";

const ActionsCell = ({ venue }: { venue: VenueApiResponse }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { mutate: deleteVenue } = useDeleteVenue();
    const { mutate: resubmitVenue } = useResubmitVenue(venue.id);

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
                        <Link href={`/renter/venues/${venue.id}`}>
                            View & Edit Details
                        </Link>
                    </DropdownMenuItem>

                    {venue.status === "REJECTED" && (
                        <ConfirmationDialog
                            trigger={
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    Reapply (Resubmit)
                                </DropdownMenuItem>
                            }
                            title="Resubmit Venue?"
                            description="This will change the status back to PENDING for admin review."
                            onConfirm={() => resubmitVenue()}
                        />
                    )}

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

export const columns: ColumnDef<VenueApiResponse>[] = [
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
    { accessorKey: "name", header: "Name" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "renter.fullName", header: "Renter" },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            const rejectionReason = row.original.rejectionReason;
            
            return (
                <Badge
                    variant={
                        status === "APPROVED"
                            ? "default"
                            : status === "REJECTED"
                            ? "destructive"
                            : "secondary"
                    }
                    title={
                        status === "REJECTED" && rejectionReason
                            ? rejectionReason
                            : undefined
                    }
                >
                    {status}
                </Badge>
            );
        },
    },
    { id: "actions", cell: ({ row }) => <ActionsCell venue={row.original} /> },
];
