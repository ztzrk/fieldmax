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
import { formatDate, formatPrice, formatTime } from "@/lib/utils";
import Link from "next/link";
import {
    BOOKING_STATUS_META,
    PAYMENT_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";

const ActionsCell = ({ booking }: { booking: BookingResponseSchema }) => {
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
                    <Link href={`/admin/bookings/${booking.id}`}>
                        Lihat Detail
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<BookingResponseSchema>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                ID Pemesanan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const id = row.getValue("id") as string;
            return (
                <div
                    className="font-medium text-sm font-mono truncate max-w-[100px]"
                    title={id}
                >
                    #{id.slice(0, 8)}
                </div>
            );
        },
    },
    {
        id: "user",
        accessorFn: (row) => row.user?.fullName,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Pengguna
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {user?.fullName || "-"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {user?.email || "-"}
                    </span>
                </div>
            );
        },
    },
    {
        id: "venue_field",
        accessorFn: (row) => row.field?.venue?.name,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tempat Olahraga / Lapangan
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const field = row.original.field;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {field?.venue?.name || "Tidak diketahui"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {field?.name || "Lapangan"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "bookingDate",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tanggal & Waktu
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const bookingDate = row.getValue("bookingDate") as string;
            const startTime = row.original.startTime;
            const endTime = row.original.endTime;
            return (
                <div className="flex flex-col">
                    <span>{formatDate(bookingDate)}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                        {formatTime(startTime)} – {formatTime(endTime)}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const meta = BOOKING_STATUS_META[status] ?? {
                label: status || "-",
                tone: "neutral" as const,
            };
            return <StatusBadge label={meta.label} tone={meta.tone} />;
        },
    },
    {
        id: "paymentStatus",
        accessorFn: (row) => row.payment?.status ?? row.paymentStatus,
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Pembayaran
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const paymentStatus =
                row.original.payment?.status ?? row.original.paymentStatus;
            const meta = paymentStatus
                ? PAYMENT_STATUS_META[paymentStatus] ?? {
                      label: paymentStatus,
                      tone: "neutral" as const,
                  }
                : { label: "Belum Ada", tone: "neutral" as const };
            return <StatusBadge label={meta.label} tone={meta.tone} />;
        },
    },
    {
        accessorKey: "totalPrice",
        header: ({ column }) => (
            <div className="text-right">
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalPrice"));
            return (
                <div className="text-right font-medium tabular-nums">
                    {formatPrice(amount)}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <ActionsCell booking={row.original} />
            </div>
        ),
    },
];
