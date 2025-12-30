"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";

// Define the type locally based on usage if not strictly available, 
// or ideally import it. For now, I'll define a shape based on the API response I saw.
export type Booking = {
    id: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "FAILED";
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    user?: {
        id: string;
        fullName: string;
        email: string;
    };
    field?: {
        name: string;
        venue?: {
            name: string;
        };
    };
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case "CONFIRMED":
        case "PAID":
            return "default";
        case "PENDING":
            return "secondary";
        case "CANCELLED":
        case "FAILED":
            return "destructive";
        case "COMPLETED":
            return "outline";
        default:
            return "secondary";
    }
};

const ActionsCell = ({ booking }: { booking: Booking }) => {
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
                    <Link href={`/admin/bookings/${booking.id}`}>
                        View Details
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "id",
        header: "Booking ID",
        cell: ({ row }) => {
            const id = row.getValue("id") as string;
            // Using a monospace font or ensuring it breaks/scrolls might be good if IDs are long UUIDs,
            // but the request is just to show full.
            return <div className="font-medium text-sm font-mono">{id}</div>;
        },
    },
    {
        id: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{user?.fullName || "N/A"}</span>
                    <span className="text-xs text-muted-foreground">
                        {user?.email || "N/A"}
                    </span>
                </div>
            );
        },
    },
    {
        id: "venue_field",
        header: "Venue / Field",
        cell: ({ row }) => {
            const field = row.original.field;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {field?.venue?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {field?.name || "Field"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "bookingDate",
        header: "Date & Time",
        cell: ({ row }) => {
            const bookingDate = row.getValue("bookingDate") as string;
            const startTime = row.original.startTime;
            const endTime = row.original.endTime;
            return (
                <div className="flex flex-col">
                    <span>{formatDate(bookingDate)}</span>
                    <span className="text-xs text-muted-foreground">
                        {formatTime(startTime)} - {formatTime(endTime)}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={getStatusVariant(status)}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string;
            return (
                <Badge variant={getStatusVariant(status)}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "totalPrice",
        header: "Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalPrice"));
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
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
             <div className="flex justify-center">
                 <ActionsCell booking={row.original} />
             </div>
         ),
    },
];
