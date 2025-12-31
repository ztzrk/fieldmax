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
import Link from "next/link";
import { formatDate, formatTime } from "@/lib/utils";
import { Booking } from "@/lib/schema/booking.schema";

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
                {/* Note: Renter booking detail page might not exist yet, but linking generally structure */}
                {/* For now, maybe just view details if the page exists, or no link if not ready.
                     The sidebar has /renter/bookings, so detail might be /renter/bookings/[id].
                     But we stick to the plan: just basic list first. 
                     I'll verify if specific detail route is needed later. 
                     For now, I'll assume /renter/bookings/[id] might be desired or just leave simple.
                     Actually, I'll copy the admin style behavior but point to renter route.
                 */}
                {/* <DropdownMenuItem asChild>
                    <Link href={`/renter/bookings/${booking.id}`}>
                        View Details
                    </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(booking.id)}
                >
                    Copy Booking ID
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
            return (
                <div
                    className="font-medium text-sm font-mono truncate max-w-[80px]"
                    title={id}
                >
                    {id.substring(0, 8)}...
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
        id: "customer",
        header: "Customer",
        cell: ({ row }) => {
            // Check if user object exists on the booking type.
            // The Booking type in schema might need updating if it doesn't have user info nested for list views,
            // but admin columns showed it. The schema file showed:
            // export type Booking = z.infer<typeof bookingSchema> & { field?: ... };
            // It didn't explicitly show 'user' in the extended type in schema file we read earlier (step 1014),
            // only field. However, Admin columns (step 1020) typed it locally.
            // I will default to "N/A" if missing to strict type safety.
            // Actually I should probably check if backend sends it.
            // Admin columns used: user?: { fullName, email }.
            // I'll type cast or rely on 'any' safely if needed, but let's try to be safe.
            const booking = row.original as any;
            const user = booking.user;

            return (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {user?.fullName || "Guest"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {user?.email || ""}
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
            return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
        },
    },
    {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string;
            return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
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
    // {
    //     id: "actions",
    //     header: () => <div className="text-center">Actions</div>,
    //     cell: ({ row }) => (
    //         <div className="flex justify-center">
    //             <ActionsCell booking={row.original} />
    //         </div>
    //     ),
    // },
];
