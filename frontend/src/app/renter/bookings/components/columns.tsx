"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Copy, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "@/components/shared/DataTable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatPrice, formatTime } from "@/lib/utils";
import { useCheckInBooking } from "@/hooks/useBookings";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";
import {
    BOOKING_STATUS_META,
    PAYMENT_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";
import { toast } from "sonner";

const ActionsCell = ({ booking }: { booking: BookingResponseSchema }) => {
    const [detailOpen, setDetailOpen] = useState(false);
    const { mutate: checkIn, isPending } = useCheckInBooking();

    const bookingMeta = BOOKING_STATUS_META[booking.status] ?? {
        label: booking.status || "-",
        tone: "neutral" as const,
    };
    const paymentStatus =
        booking.payment?.status ?? booking.paymentStatus;
    const paymentMeta = paymentStatus
        ? PAYMENT_STATUS_META[paymentStatus] ?? {
              label: paymentStatus,
              tone: "neutral" as const,
          }
        : { label: "Belum Ada", tone: "neutral" as const };

    const handleCopyId = () => {
        navigator.clipboard.writeText(booking.id);
        toast.success("ID pemesanan berhasil disalin");
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu aksi</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setDetailOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                    </DropdownMenuItem>
                    {booking.status === "CONFIRMED" && !booking.checkedInAt && (
                        <DropdownMenuItem
                            disabled={isPending}
                            onClick={() => checkIn(booking.id)}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Konfirmasi Hadir (Check-In)
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCopyId}>
                        <Copy className="mr-2 h-4 w-4" />
                        Salin ID Pemesanan
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detail Pemesanan</DialogTitle>
                        <DialogDescription className="font-mono text-xs">
                            ID: #{booking.id.slice(0, 8)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 p-3">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Status Pesanan
                                </p>
                                <div className="mt-1">
                                    <StatusBadge
                                        label={bookingMeta.label}
                                        tone={bookingMeta.tone}
                                    />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                    Pembayaran
                                </p>
                                <div className="mt-1">
                                    <StatusBadge
                                        label={paymentMeta.label}
                                        tone={paymentMeta.tone}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 rounded-lg border p-3">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Pelanggan
                                </p>
                                <p className="font-medium">
                                    {booking.user?.fullName || "Tamu"}
                                </p>
                                {booking.user?.email && (
                                    <p className="text-xs text-muted-foreground truncate">
                                        {booking.user.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Total
                                </p>
                                <p className="font-semibold text-primary tabular-nums">
                                    {formatPrice(booking.totalPrice)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tempat Olahraga
                                </p>
                                <p className="font-medium">
                                    {booking.field?.venue?.name ||
                                        "Tidak diketahui"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Lapangan
                                </p>
                                <p className="font-medium">
                                    {booking.field?.name || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal Main
                                </p>
                                <p className="font-medium">
                                    {formatDate(booking.bookingDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Jam Main
                                </p>
                                <p className="font-medium tabular-nums">
                                    {formatTime(booking.startTime)} –{" "}
                                    {formatTime(booking.endTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
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
