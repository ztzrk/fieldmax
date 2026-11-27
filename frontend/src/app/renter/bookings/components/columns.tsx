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
import { formatDate, formatPrice, formatTime } from "@/lib/utils";
import { useCheckInBooking } from "@/hooks/useBookings";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import {
    BOOKING_STATUS_META,
    PAYMENT_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";

const ActionsCell = ({ booking }: { booking: BookingResponseSchema }) => {
    const { mutate: checkIn } = useCheckInBooking();

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
                {booking.status === "CONFIRMED" && !booking.checkedInAt && (
                    <DropdownMenuItem onClick={() => checkIn(booking.id)}>
                        Konfirmasi Hadir (Check-In)
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(booking.id)}
                >
                    Salin ID Pemesanan
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<BookingResponseSchema>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <SortableHeader column={column} title="ID Pemesanan" />
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
        id: "venue_field",
        accessorFn: (row) => row.field?.venue?.name,
        header: ({ column }) => (
            <SortableHeader
                column={column}
                title="Tempat Olahraga / Lapangan"
            />
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
        id: "user",
        accessorFn: (row) => row.user?.fullName,
        header: ({ column }) => (
            <SortableHeader column={column} title="Pelanggan" />
        ),
        cell: ({ row }) => {
            const user = row.original.user;

            return (
                <div className="flex flex-col">
                    <span className="font-medium">
                        {user?.fullName || "Tamu"}
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
        header: ({ column }) => (
            <SortableHeader column={column} title="Tanggal & Waktu" />
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
            <SortableHeader column={column} title="Status" />
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
        id: "checkedInAt",
        header: "Kehadiran",
        cell: ({ row }) => {
            const { status, checkedInAt } = row.original;
            if (checkedInAt) {
                const formatted = formatTime(checkedInAt);
                return (
                    <StatusBadge
                        label={`Hadir (${formatted})`}
                        tone="success"
                    />
                );
            }
            if (status === "NO_SHOW") {
                return <StatusBadge label="Tidak Hadir" tone="destructive" />;
            }
            return <StatusBadge label="Belum Hadir" tone="neutral" />;
        },
    },
    {
        id: "paymentStatus",
        accessorFn: (row) => row.payment?.status ?? row.paymentStatus,
        header: ({ column }) => (
            <SortableHeader column={column} title="Pembayaran" />
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
            <SortableHeader column={column} title="Total" align="right" />
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
