"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye } from "lucide-react";
import { SortableHeader } from "@/components/shared/DataTable";
import {
    BOOKING_STATUS_META,
    PAYMENT_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import type { RevenueTransaction } from "@/services/renter.service";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

/**
 * Builds DataTable columns for the renter financial transaction ledger.
 */
export function getRevenueTransactionColumns(
    onInspect: (transaction: RevenueTransaction) => void
): ColumnDef<RevenueTransaction>[] {
    return [
        {
            accessorKey: "id",
            header: "Referensi",
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <button
                        type="button"
                        onClick={() => onInspect(tx)}
                        className="font-mono text-xs font-medium text-foreground hover:text-primary hover:underline tabular-nums"
                        title={`Lihat rincian #${tx.id.slice(0, 8).toUpperCase()}`}
                    >
                        #{tx.id.slice(0, 8).toUpperCase()}
                    </button>
                );
            },
        },
        {
            accessorKey: "bookingDate",
            header: ({ column }) => (
                <SortableHeader column={column} title="Jadwal Main" />
            ),
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div className="flex flex-col whitespace-nowrap">
                        <span className="font-medium text-sm tabular-nums">
                            {formatDate(tx.bookingDate)}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {formatTime(tx.startTime)} – {formatTime(tx.endTime)}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "user",
            accessorFn: (row) => row.user.fullName,
            header: "Pelanggan",
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <div className="flex flex-col min-w-0 max-w-[200px]">
                        <span className="font-medium text-sm truncate">
                            {tx.user.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                            {tx.user.email}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "field_name",
            accessorFn: (row) => `${row.field.name} ${row.field.venue.name}`,
            header: "Lapangan & Venue",
            cell: ({ row }) => {
                const tx = row.original;
                return (
                    <Link
                        href={`/renter/fields/${tx.field.id}?fromVenue=${tx.field.venue.id}`}
                        className="group flex flex-col min-w-0 max-w-[220px]"
                    >
                        <span className="font-medium text-sm truncate group-hover:text-primary group-hover:underline">
                            {tx.field.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                            {tx.field.venue.name}
                        </span>
                    </Link>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status Pesanan",
            cell: ({ row }) => {
                const status = row.original.status;
                const meta = BOOKING_STATUS_META[status] ?? {
                    label: status,
                    tone: "neutral" as const,
                };
                return <StatusBadge label={meta.label} tone={meta.tone} dot />;
            },
        },
        {
            id: "paymentStatus",
            accessorFn: (row) => row.payment?.status || "PENDING",
            header: "Pembayaran",
            cell: ({ row }) => {
                const payStatus = row.original.payment?.status || "PENDING";
                const meta = PAYMENT_STATUS_META[payStatus] ?? {
                    label: payStatus,
                    tone: "warning" as const,
                };
                return <StatusBadge label={meta.label} tone={meta.tone} dot />;
            },
        },
        {
            accessorKey: "checkedInAt",
            header: "Kehadiran",
            cell: ({ row }) => {
                const checkedIn = Boolean(row.original.checkedInAt);
                return checkedIn ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-status-success whitespace-nowrap">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Check-In
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: "totalPrice",
            header: ({ column }) => (
                <SortableHeader
                    column={column}
                    title="Nominal"
                    align="right"
                />
            ),
            cell: ({ row }) => (
                <div className="text-right font-semibold tabular-nums whitespace-nowrap">
                    {formatCurrency(row.original.totalPrice)}
                </div>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onInspect(row.original)}
                        aria-label={`Lihat rincian transaksi ${row.original.id.slice(0, 8)}`}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];
}
