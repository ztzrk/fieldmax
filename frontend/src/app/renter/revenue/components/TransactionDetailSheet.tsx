"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Mail,
    MapPin,
    Phone,
    Receipt,
    User,
} from "lucide-react";
import {
    BOOKING_STATUS_META,
    PAYMENT_STATUS_META,
    StatusBadge,
} from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import type { RevenueTransaction } from "@/services/renter.service";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

interface TransactionDetailSheetProps {
    transaction: RevenueTransaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Slide-over detail drawer for inspecting a single revenue/booking ledger row.
 */
export function TransactionDetailSheet({
    transaction,
    open,
    onOpenChange,
}: TransactionDetailSheetProps) {
    const [copied, setCopied] = useState(false);

    if (!transaction) {
        return null;
    }

    const bookingMeta = BOOKING_STATUS_META[transaction.status] ?? {
        label: transaction.status,
        tone: "neutral" as const,
    };

    const paymentStatusKey = transaction.payment?.status || "PENDING";
    const paymentMeta = PAYMENT_STATUS_META[paymentStatusKey] ?? {
        label: paymentStatusKey,
        tone: "warning" as const,
    };

    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(transaction.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard access may be denied in restricted contexts
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md flex flex-col overflow-y-auto">
                <SheetHeader className="border-b border-border/60 pb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Receipt className="h-3.5 w-3.5 text-primary" />
                        <span>Rincian Transaksi</span>
                    </div>
                    <SheetTitle className="text-2xl font-bold tracking-tight text-primary tabular-nums">
                        {formatCurrency(transaction.totalPrice)}
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-2 pt-0.5">
                        <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground">
                            #{transaction.id.slice(0, 8).toUpperCase()}
                        </code>
                        <button
                            type="button"
                            onClick={handleCopyId}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            title="Salin ID lengkap"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3 w-3 text-status-success" />
                                    <span className="text-status-success">
                                        Tersalin
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3 w-3" />
                                    <span>Salin ID</span>
                                </>
                            )}
                        </button>
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-5 px-4 py-2">
                    {/* Status Row */}
                    <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-muted/20 p-3.5">
                        <div className="space-y-1">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                Pembayaran
                            </p>
                            <StatusBadge
                                label={paymentMeta.label}
                                tone={paymentMeta.tone}
                                dot
                            />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                Status Pesanan
                            </p>
                            <StatusBadge
                                label={bookingMeta.label}
                                tone={bookingMeta.tone}
                                dot
                            />
                        </div>
                    </div>

                    {/* Schedule & Attendance */}
                    <div className="space-y-2.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Jadwal & Kehadiran
                        </h4>
                        <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5 text-sm">
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    Tanggal Main
                                </span>
                                <span className="font-medium text-foreground tabular-nums">
                                    {formatDate(transaction.bookingDate)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Sesi Waktu
                                </span>
                                <span className="font-semibold text-foreground tabular-nums">
                                    {formatTime(transaction.startTime)} –{" "}
                                    {formatTime(transaction.endTime)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                                <span className="text-muted-foreground">
                                    Status Check-In
                                </span>
                                {transaction.checkedInAt ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-status-success">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Sudah Check-In
                                    </span>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        Belum check-in
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Venue & Field Info */}
                    <div className="space-y-2.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Unit Lapangan
                        </h4>
                        <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-sm text-foreground">
                                        {transaction.field.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        {transaction.field.venue.name}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-7 px-2 text-xs text-primary"
                                >
                                    <Link
                                        href={`/renter/fields/${transaction.field.id}?fromVenue=${transaction.field.venue.id}`}
                                    >
                                        Buka
                                        <ArrowUpRight className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Pelanggan
                        </h4>
                        <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2 text-sm">
                            <div className="flex items-center gap-2 font-medium text-foreground">
                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{transaction.user.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">
                                    {transaction.user.email}
                                </span>
                            </div>
                            {transaction.user.phoneNumber && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                                    <Phone className="h-3.5 w-3.5 shrink-0" />
                                    <span>{transaction.user.phoneNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reference Metadata */}
                    <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5 text-xs space-y-1.5 text-muted-foreground">
                        <div className="flex justify-between gap-3">
                            <span>Dibuat pada</span>
                            <span className="text-foreground tabular-nums">
                                {formatDate(transaction.createdAt)}
                            </span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span>ID Lengkap</span>
                            <span className="font-mono text-[11px] text-foreground break-all text-right">
                                {transaction.id}
                            </span>
                        </div>
                    </div>
                </div>

                <SheetFooter className="border-t border-border/60 pt-4">
                    <Button asChild className="w-full">
                        <Link
                            href={`/renter/bookings?search=${encodeURIComponent(transaction.user.fullName)}`}
                        >
                            Kelola di Daftar Pemesanan
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
