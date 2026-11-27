"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import type { PaginationState } from "@tanstack/react-table";
import {
    ArrowUpRight,
    Building2,
    CalendarRange,
    Clock,
    Download,
    Info,
    Receipt,
    RefreshCw,
    Star,
    TrendingUp,
    Trophy,
    Wallet,
} from "lucide-react";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";
import {
    type ActiveFilterChip,
    DataTable,
} from "@/components/shared/DataTable";
import {
    DataTableFacetedFilter,
    type FacetedFilterOption,
} from "@/components/shared/DataTableFacetedFilter";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRenterRevenue } from "@/hooks/useDashboard";
import {
    BOOKING_STATUS_OPTIONS,
    PAYMENT_STATUS_OPTIONS,
    REVENUE_TRANSACTION_COLUMN_LABELS,
} from "@/lib/table-filter-options";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type {
    RevenuePeriod,
    RevenueTransaction,
} from "@/services/renter.service";
import { getRevenueTransactionColumns } from "./components/columns";
import { RevenueBreakdownChart } from "./components/RevenueBreakdownChart";
import { TransactionDetailSheet } from "./components/TransactionDetailSheet";

const PERIOD_OPTIONS: { value: RevenuePeriod; label: string }[] = [
    { value: "this_month", label: "Bulan Ini" },
    { value: "7d", label: "7 Hari Terakhir" },
    { value: "30d", label: "30 Hari Terakhir" },
    { value: "last_month", label: "Bulan Lalu" },
    { value: "all", label: "Semua Waktu" },
];

const PERIOD_LABEL_MAP: Record<RevenuePeriod, string> = {
    this_month: "Bulan Ini",
    "7d": "7 Hari Terakhir",
    "30d": "30 Hari Terakhir",
    last_month: "Bulan Lalu",
    all: "Semua Waktu",
};

/**
 * Escapes CSV fields safely including formula-injection mitigation.
 */
function sanitizeCsvCell(value: string | number): string {
    const raw = String(value ?? "");
    const safe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
    return `"${safe.replace(/"/g, '""')}"`;
}

/**
 * Renter Financial & Revenue Reporting Page.
 * Displays cash position KPIs, period & venue scoping, interactive breakdown charts,
 * faceted multi-filter transaction ledger, slide-over detail sheet, and safe CSV export.
 */
export default function RevenuePage() {
    const [period, setPeriod] = useState<RevenuePeriod>("this_month");
    const [selectedVenueId, setSelectedVenueId] = useState<string>("ALL");

    // Local ledger filters & pagination
    const [searchQuery, setSearchQuery] = useState("");
    const [bookingStatuses, setBookingStatuses] = useState<string[]>([]);
    const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);
    const [venueFilters, setVenueFilters] = useState<string[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Slide-over inspection state
    const [inspectedTransaction, setInspectedTransaction] =
        useState<RevenueTransaction | null>(null);

    const {
        data: stats,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useRenterRevenue({
        period,
        venueId: selectedVenueId === "ALL" ? undefined : selectedVenueId,
    });

    const venueFacetOptions: FacetedFilterOption[] = useMemo(
        () =>
            (stats?.venueOptions || []).map((v) => ({
                value: v.venueId,
                label: v.venueName,
            })),
        [stats?.venueOptions]
    );

    const filteredFields = useMemo(() => {
        if (!stats) return [];
        if (selectedVenueId === "ALL") return stats.revenueByField;
        return stats.revenueByField.filter(
            (f) => f.venueId === selectedVenueId
        );
    }, [stats, selectedVenueId]);

    const filteredVenues = useMemo(() => {
        if (!stats) return [];
        if (selectedVenueId === "ALL") return stats.revenueByVenue;
        return stats.revenueByVenue.filter(
            (v) => v.venueId === selectedVenueId
        );
    }, [stats, selectedVenueId]);

    const filteredTransactions = useMemo(() => {
        if (!stats?.transactions) return [];
        const q = searchQuery.trim().toLowerCase();

        return stats.transactions.filter((tx) => {
            if (
                bookingStatuses.length > 0 &&
                !bookingStatuses.includes(tx.status)
            ) {
                return false;
            }
            const payStatus = tx.payment?.status || "PENDING";
            if (
                paymentStatuses.length > 0 &&
                !paymentStatuses.includes(payStatus)
            ) {
                return false;
            }
            if (
                venueFilters.length > 0 &&
                !venueFilters.includes(tx.field.venue.id)
            ) {
                return false;
            }
            if (q) {
                const haystacks = [
                    tx.id.toLowerCase(),
                    tx.id.slice(0, 8).toLowerCase(),
                    tx.user.fullName.toLowerCase(),
                    tx.user.email.toLowerCase(),
                    tx.field.name.toLowerCase(),
                    tx.field.venue.name.toLowerCase(),
                ];
                if (!haystacks.some((item) => item.includes(q))) {
                    return false;
                }
            }
            return true;
        });
    }, [
        stats?.transactions,
        searchQuery,
        bookingStatuses,
        paymentStatuses,
        venueFilters,
    ]);

    const paginatedTransactions = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        return filteredTransactions.slice(start, start + pagination.pageSize);
    }, [filteredTransactions, pagination]);

    const pageCount = useMemo(
        () =>
            Math.max(
                1,
                Math.ceil(filteredTransactions.length / pagination.pageSize)
            ),
        [filteredTransactions.length, pagination.pageSize]
    );

    const activeFilterChips: ActiveFilterChip[] = useMemo(() => {
        const chips: ActiveFilterChip[] = [];

        bookingStatuses.forEach((val) => {
            const label =
                BOOKING_STATUS_OPTIONS.find((opt) => opt.value === val)
                    ?.label || val;
            chips.push({
                key: `booking-${val}`,
                label: "Pesanan",
                valueLabel: label,
                onRemove: () => {
                    setBookingStatuses((prev) => prev.filter((x) => x !== val));
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                },
            });
        });

        paymentStatuses.forEach((val) => {
            const label =
                PAYMENT_STATUS_OPTIONS.find((opt) => opt.value === val)
                    ?.label || val;
            chips.push({
                key: `payment-${val}`,
                label: "Pembayaran",
                valueLabel: label,
                onRemove: () => {
                    setPaymentStatuses((prev) => prev.filter((x) => x !== val));
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                },
            });
        });

        venueFilters.forEach((val) => {
            const label =
                venueFacetOptions.find((opt) => opt.value === val)?.label ||
                val;
            chips.push({
                key: `venue-${val}`,
                label: "Tempat",
                valueLabel: label,
                onRemove: () => {
                    setVenueFilters((prev) => prev.filter((x) => x !== val));
                    setPagination((p) => ({ ...p, pageIndex: 0 }));
                },
            });
        });

        return chips;
    }, [bookingStatuses, paymentStatuses, venueFilters, venueFacetOptions]);

    const columns = useMemo(
        () => getRevenueTransactionColumns((tx) => setInspectedTransaction(tx)),
        []
    );

    const handleResetLedgerFilters = () => {
        setSearchQuery("");
        setBookingStatuses([]);
        setPaymentStatuses([]);
        setVenueFilters([]);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
    };

    const handlePeriodChange = (nextPeriod: RevenuePeriod) => {
        setPeriod(nextPeriod);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
    };

    const handleGlobalVenueChange = (nextVenueId: string) => {
        setSelectedVenueId(nextVenueId);
        setVenueFilters([]);
        setPagination((p) => ({ ...p, pageIndex: 0 }));
    };

    const handleExportCsv = () => {
        if (filteredTransactions.length === 0) return;

        const headers = [
            "ID Pesanan",
            "Tanggal Main",
            "Jam Mulai",
            "Jam Selesai",
            "Pelanggan",
            "Email",
            "Tempat Olahraga",
            "Lapangan",
            "Status Pesanan",
            "Status Pembayaran",
            "Kehadiran",
            "Nominal (Rp)",
        ];

        const rows = filteredTransactions.map((tx) => [
            sanitizeCsvCell(tx.id),
            sanitizeCsvCell(formatDate(tx.bookingDate)),
            sanitizeCsvCell(formatTime(tx.startTime)),
            sanitizeCsvCell(formatTime(tx.endTime)),
            sanitizeCsvCell(tx.user.fullName),
            sanitizeCsvCell(tx.user.email),
            sanitizeCsvCell(tx.field.venue.name),
            sanitizeCsvCell(tx.field.name),
            sanitizeCsvCell(tx.status),
            sanitizeCsvCell(tx.payment?.status || "PENDING"),
            sanitizeCsvCell(tx.checkedInAt ? "Check-In" : "-"),
            String(tx.totalPrice),
        ]);

        const csvContent =
            "\uFEFF" +
            [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `laporan-keuangan-${period}-${format(new Date(), "yyyy-MM-dd")}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return <RevenueSkeleton />;
    }

    if (error || !stats) {
        return (
            <div className="text-destructive font-medium p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                Gagal memuat data keuangan. Silakan muat ulang halaman.
            </div>
        );
    }

    const updatedTimeLabel = stats.generatedAt
        ? format(new Date(stats.generatedAt), "HH:mm")
        : "--:--";

    return (
        <div className="space-y-6">
            {/* Financial Header & Global Scope Controls */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Pendapatan & Laporan Keuangan
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span>
                            Pantau posisi kas lunas, tagihan tertunda, dan
                            riwayat transaksi persewaan.
                        </span>
                        <span
                            aria-hidden="true"
                            className="hidden sm:inline text-border"
                        >
                            •
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs tabular-nums">
                            Diperbarui pukul {updatedTimeLabel}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select
                        value={period}
                        onValueChange={(v) =>
                            handlePeriodChange(v as RevenuePeriod)
                        }
                    >
                        <SelectTrigger
                            className="w-[175px] bg-card"
                            aria-label="Filter periode laporan"
                        >
                            <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            {PERIOD_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedVenueId}
                        onValueChange={handleGlobalVenueChange}
                    >
                        <SelectTrigger
                            className="w-[210px] bg-card"
                            aria-label="Filter tempat olahraga"
                        >
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                            <SelectValue placeholder="Semua Tempat Olahraga" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Semua Tempat Olahraga
                            </SelectItem>
                            {stats.venueOptions.map((v) => (
                                <SelectItem key={v.venueId} value={v.venueId}>
                                    {v.venueName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="bg-card"
                        aria-label="Muat ulang data keuangan"
                        title="Muat ulang data keuangan"
                    >
                        <RefreshCw
                            className={cn(
                                "h-4 w-4",
                                isFetching && "animate-spin"
                            )}
                        />
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={filteredTransactions.length === 0}
                        className="gap-2 bg-card"
                    >
                        <Download className="h-4 w-4" />
                        Ekspor CSV ({filteredTransactions.length})
                    </Button>
                </div>
            </div>

            {/* Tier 1: Cash Position & Performance KPI Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardKpiCard
                    title={`Pendapatan Lunas (${PERIOD_LABEL_MAP[period]})`}
                    value={formatCurrency(stats.totalRevenue)}
                    valueTone="primary"
                    icon={Wallet}
                    iconTone="primary"
                    subtitle={
                        <span>
                            <strong className="text-foreground tabular-nums">
                                {stats.totalPaidBookings}
                            </strong>{" "}
                            transaksi berhasil dibayar
                        </span>
                    }
                />

                <DashboardKpiCard
                    title="Pendapatan Bulan Ini"
                    value={formatCurrency(stats.monthlyRevenue)}
                    icon={TrendingUp}
                    iconTone="success"
                    deltaPct={stats.revenueDeltaPct}
                    subtitle={
                        <span>
                            Bulan lalu:{" "}
                            <strong className="text-foreground tabular-nums">
                                {formatCurrency(stats.lastMonthRevenue)}
                            </strong>
                        </span>
                    }
                />

                <DashboardKpiCard
                    title="Pembayaran Tertunda"
                    value={formatCurrency(stats.pendingRevenue)}
                    icon={Clock}
                    iconTone="warning"
                    subtitle={
                        <span>
                            <strong className="text-foreground tabular-nums">
                                {stats.pendingCount}
                            </strong>{" "}
                            tagihan menunggu pembayaran
                        </span>
                    }
                />

                <DashboardKpiCard
                    title="Rata-rata per Pesanan"
                    value={formatCurrency(stats.averageOrderValue)}
                    icon={Receipt}
                    iconTone="info"
                    subtitle={
                        <span>
                            Tingkat kelunasan:{" "}
                            <strong className="text-foreground tabular-nums">
                                {stats.paidRatePct}%
                            </strong>{" "}
                            ({stats.totalPaidBookings}/{stats.totalOrdersCount})
                        </span>
                    }
                />
            </div>

            {/* Tier 2: Ledger Table & Performance Breakdowns */}
            <Tabs defaultValue="orders" className="space-y-4">
                <TabsList className="bg-card border border-border/70 p-1 h-auto flex-wrap justify-start">
                    <TabsTrigger
                        value="orders"
                        className="gap-2 py-1.5 px-3.5 text-sm"
                    >
                        <Receipt className="h-4 w-4" />
                        Riwayat Transaksi ({filteredTransactions.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="field"
                        className="gap-2 py-1.5 px-3.5 text-sm"
                    >
                        <Trophy className="h-4 w-4" />
                        Performa Lapangan ({filteredFields.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="venue"
                        className="gap-2 py-1.5 px-3.5 text-sm"
                    >
                        <Building2 className="h-4 w-4" />
                        Performa Tempat Olahraga ({filteredVenues.length})
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Interactive Multi-Filter Financial Ledger */}
                <TabsContent value="orders" className="space-y-4">
                    {stats.totalTransactionsCount > stats.transactions.length && (
                        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-4 py-2.5 text-xs text-muted-foreground">
                            <Info className="h-4 w-4 shrink-0 text-primary" />
                            <span>
                                Menampilkan{" "}
                                <strong className="text-foreground tabular-nums">
                                    {stats.transactions.length}
                                </strong>{" "}
                                transaksi terbaru dari total{" "}
                                <strong className="text-foreground tabular-nums">
                                    {stats.totalTransactionsCount}
                                </strong>{" "}
                                transaksi pada periode ini. Gunakan filter
                                periode untuk mempersempit rentang waktu.
                            </span>
                        </div>
                    )}

                    <Card className="rounded-xl border border-border/70 bg-card">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-base font-semibold">
                                Buku Besar Transaksi
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Klik kode referensi atau ikon mata pada baris
                                transaksi untuk melihat rincian lengkap.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <DataTable
                                columns={columns}
                                data={paginatedTransactions}
                                pageCount={pageCount}
                                pagination={pagination}
                                onPaginationChange={setPagination}
                                searchValue={searchQuery}
                                onSearch={(val) => {
                                    setSearchQuery(val);
                                    setPagination((p) => ({
                                        ...p,
                                        pageIndex: 0,
                                    }));
                                }}
                                searchPlaceholder="Cari ID referensi, pelanggan, atau lapangan..."
                                isFetching={isFetching}
                                columnLabels={
                                    REVENUE_TRANSACTION_COLUMN_LABELS
                                }
                                activeFilterChips={activeFilterChips}
                                onResetFilters={handleResetLedgerFilters}
                                filters={
                                    <>
                                        <DataTableFacetedFilter
                                            title="Status Pesanan"
                                            options={BOOKING_STATUS_OPTIONS}
                                            values={bookingStatuses}
                                            onChange={(vals) => {
                                                setBookingStatuses(vals);
                                                setPagination((p) => ({
                                                    ...p,
                                                    pageIndex: 0,
                                                }));
                                            }}
                                        />
                                        <DataTableFacetedFilter
                                            title="Pembayaran"
                                            options={PAYMENT_STATUS_OPTIONS}
                                            values={paymentStatuses}
                                            onChange={(vals) => {
                                                setPaymentStatuses(vals);
                                                setPagination((p) => ({
                                                    ...p,
                                                    pageIndex: 0,
                                                }));
                                            }}
                                        />
                                        {selectedVenueId === "ALL" &&
                                            venueFacetOptions.length > 1 && (
                                                <DataTableFacetedFilter
                                                    title="Tempat Olahraga"
                                                    options={venueFacetOptions}
                                                    values={venueFilters}
                                                    onChange={(vals) => {
                                                        setVenueFilters(vals);
                                                        setPagination((p) => ({
                                                            ...p,
                                                            pageIndex: 0,
                                                        }));
                                                    }}
                                                />
                                            )}
                                    </>
                                }
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Field Revenue Breakdown */}
                <TabsContent value="field" className="space-y-4">
                    <RevenueBreakdownChart
                        title="Grafik Pendapatan per Lapangan"
                        description={`Kontribusi pendapatan unit lapangan (${PERIOD_LABEL_MAP[period]})`}
                        data={filteredFields.map((f) => ({
                            name: f.fieldName,
                            subtitle: f.venueName,
                            totalRevenue: f.totalRevenue,
                            bookingCount: f.bookingCount,
                        }))}
                    />

                    <Card className="rounded-xl border border-border/70 bg-card">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-base font-semibold">
                                Evaluasi & Optimasi Lapangan
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Klik tombol Kelola untuk mengatur tarif, foto,
                                atau status buka-tutup unit lapangan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Lapangan</TableHead>
                                            <TableHead>Tarif / Jam</TableHead>
                                            <TableHead>Pesanan Lunas</TableHead>
                                            <TableHead>Rating</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Total Pendapatan
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredFields.map((field) => (
                                            <TableRow
                                                key={field.fieldId}
                                                className="hover:bg-muted/40"
                                            >
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">
                                                            {field.fieldName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {field.venueName}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="tabular-nums text-sm">
                                                    {formatCurrency(
                                                        field.pricePerHour
                                                    )}
                                                </TableCell>
                                                <TableCell className="tabular-nums text-sm">
                                                    {field.bookingCount} pesanan
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center gap-1 text-sm tabular-nums">
                                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                        {field.averageRating > 0
                                                            ? `${field.averageRating} (${field.reviewCount})`
                                                            : "-"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge
                                                        label={
                                                            field.isClosed
                                                                ? "Tutup"
                                                                : "Aktif"
                                                        }
                                                        tone={
                                                            field.isClosed
                                                                ? "destructive"
                                                                : "success"
                                                        }
                                                        dot
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums">
                                                    {formatCurrency(
                                                        field.totalRevenue
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 gap-1 text-xs"
                                                    >
                                                        <Link
                                                            href={`/renter/fields/${field.fieldId}?fromVenue=${field.venueId}`}
                                                        >
                                                            Kelola
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredFields.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    className="text-center h-24 text-muted-foreground"
                                                >
                                                    Belum ada data lapangan.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Venue Revenue Breakdown */}
                <TabsContent value="venue" className="space-y-4">
                    <RevenueBreakdownChart
                        title="Grafik Pendapatan per Tempat Olahraga"
                        description={`Perbandingan kinerja seluruh venue (${PERIOD_LABEL_MAP[period]})`}
                        data={filteredVenues.map((v) => ({
                            name: v.venueName,
                            subtitle: `${v.fieldCount} unit lapangan`,
                            totalRevenue: v.totalRevenue,
                            bookingCount: v.bookingCount,
                        }))}
                    />

                    <Card className="rounded-xl border border-border/70 bg-card">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-base font-semibold">
                                Rincian per Tempat Olahraga
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                Nama Tempat Olahraga
                                            </TableHead>
                                            <TableHead>
                                                Jumlah Lapangan
                                            </TableHead>
                                            <TableHead>Pesanan Lunas</TableHead>
                                            <TableHead className="text-right">
                                                Total Pendapatan
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredVenues.map((venue) => (
                                            <TableRow
                                                key={venue.venueId}
                                                className="hover:bg-muted/40"
                                            >
                                                <TableCell className="font-medium text-sm">
                                                    {venue.venueName}
                                                </TableCell>
                                                <TableCell className="tabular-nums text-sm">
                                                    {venue.fieldCount} unit
                                                </TableCell>
                                                <TableCell className="tabular-nums text-sm">
                                                    {venue.bookingCount} pesanan
                                                </TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums">
                                                    {formatCurrency(
                                                        venue.totalRevenue
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 gap-1 text-xs"
                                                    >
                                                        <Link
                                                            href={`/renter/venues/${venue.venueId}`}
                                                        >
                                                            Kelola
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredVenues.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="text-center h-24 text-muted-foreground"
                                                >
                                                    Belum ada data pendapatan.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <TransactionDetailSheet
                transaction={inspectedTransaction}
                open={Boolean(inspectedTransaction)}
                onOpenChange={(open) => {
                    if (!open) setInspectedTransaction(null);
                }}
            />
        </div>
    );
}

/**
 * Loading skeleton matching the Revenue Page layout to avoid CLS.
 */
function RevenueSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[300px]" />
                    <Skeleton className="h-4 w-[420px] max-w-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-9 w-[175px] rounded-md" />
                    <Skeleton className="h-9 w-[210px] rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-[140px] rounded-md" />
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[132px] rounded-xl" />
                ))}
            </div>

            <Skeleton className="h-10 w-[460px] max-w-full rounded-lg" />
            <Skeleton className="h-[440px] rounded-xl" />
        </div>
    );
}
