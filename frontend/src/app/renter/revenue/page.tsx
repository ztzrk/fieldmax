"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useRenterRevenue } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {
    ArrowUpRight,
    Building2,
    CalendarCheck,
    CheckCircle2,
    Download,
    Filter,
    Receipt,
    Search,
    Star,
    TrendingUp,
    Trophy,
    Wallet,
} from "lucide-react";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    CONFIRMED: {
        label: "Terkonfirmasi",
        className:
            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300",
    },
    COMPLETED: {
        label: "Selesai",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    PENDING: {
        label: "Menunggu Bayar",
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
    },
    CANCELLED: {
        label: "Dibatalkan",
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
    },
    NO_SHOW: {
        label: "Tidak Hadir",
        className:
            "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
    },
};

function formatCompactRp(value: number) {
    if (value >= 1_000_000) {
        return `Rp ${(value / 1_000_000).toFixed(1).replace(".0", "")}jt`;
    }
    if (value >= 1_000) {
        return `Rp ${Math.round(value / 1_000)}rb`;
    }
    return `Rp ${value}`;
}

export default function RevenuePage() {
    const { data: stats, isLoading, error } = useRenterRevenue();
    const [selectedVenueId, setSelectedVenueId] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

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
            const matchesVenue =
                selectedVenueId === "ALL" ||
                tx.field.venue.id === selectedVenueId;
            const matchesStatus =
                statusFilter === "ALL" || tx.status === statusFilter;
            const matchesSearch =
                !q ||
                tx.user.fullName.toLowerCase().includes(q) ||
                tx.user.email.toLowerCase().includes(q) ||
                tx.field.name.toLowerCase().includes(q) ||
                tx.field.venue.name.toLowerCase().includes(q);
            return matchesVenue && matchesStatus && matchesSearch;
        });
    }, [stats, selectedVenueId, statusFilter, searchQuery]);

    const handleExportCsv = () => {
        if (filteredTransactions.length === 0) return;
        const headers = [
            "ID Pesanan",
            "Tanggal Main",
            "Jam",
            "Pelanggan",
            "Email",
            "Tempat Olahraga",
            "Lapangan",
            "Status",
            "Pembayaran",
            "Total (Rp)",
        ];
        const rows = filteredTransactions.map((tx) => [
            tx.id,
            format(new Date(tx.bookingDate), "yyyy-MM-dd"),
            `${format(new Date(tx.startTime), "HH:mm")} - ${format(new Date(tx.endTime), "HH:mm")}`,
            `"${tx.user.fullName}"`,
            tx.user.email,
            `"${tx.field.venue.name}"`,
            `"${tx.field.name}"`,
            tx.status,
            tx.payment?.status || "PENDING",
            tx.totalPrice,
        ]);
        const csvContent = [
            headers.join(","),
            ...rows.map((r) => r.join(",")),
        ].join("\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `laporan-pendapatan-${format(new Date(), "yyyy-MM-dd")}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-destructive font-medium">
                Gagal memuat data pendapatan.
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            {/* Header + Global Venue Filter + CSV Export */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Pendapatan & Performa
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Analisis pendapatan, pantau seluruh pesanan, dan
                        evaluasi performa tiap lapangan Anda.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Select
                        value={selectedVenueId}
                        onValueChange={setSelectedVenueId}
                    >
                        <SelectTrigger className="w-[220px] bg-card">
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                            <SelectValue placeholder="Semua Tempat Olahraga" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Semua Tempat Olahraga
                            </SelectItem>
                            {stats.revenueByVenue.map((v) => (
                                <SelectItem key={v.venueId} value={v.venueId}>
                                    {v.venueName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={handleExportCsv}
                        disabled={filteredTransactions.length === 0}
                        className="gap-2 bg-card"
                    >
                        <Download className="h-4 w-4" />
                        Ekspor CSV
                    </Button>
                </div>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="rounded-2xl border-border/70 shadow-sm hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pendapatan
                        </CardTitle>
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akumulasi seluruh pembayaran lunas
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pendapatan Bulan Ini
                        </CardTitle>
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {formatCurrency(stats.monthlyRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Periode bulan berjalan
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Pesanan Lunas
                        </CardTitle>
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <CalendarCheck className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {stats.totalPaidBookings}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total transaksi berhasil dibayar
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Rata-rata per Pesanan
                        </CardTitle>
                        <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                            <Receipt className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            {formatCurrency(stats.averageOrderValue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Nilai rata-rata setiap pemesanan
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 3 Interactive Tabs */}
            <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="bg-card border border-border/70 p-1 h-auto flex-wrap justify-start">
                    <TabsTrigger value="orders" className="gap-2 py-2 px-4">
                        <Receipt className="h-4 w-4" />
                        Semua Pesanan ({filteredTransactions.length})
                    </TabsTrigger>
                    <TabsTrigger value="field" className="gap-2 py-2 px-4">
                        <Trophy className="h-4 w-4" />
                        Performa Lapangan ({filteredFields.length})
                    </TabsTrigger>
                    <TabsTrigger value="venue" className="gap-2 py-2 px-4">
                        <Building2 className="h-4 w-4" />
                        Performa Tempat Olahraga ({filteredVenues.length})
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: All Orders / Transactions */}
                <TabsContent value="orders" className="space-y-4">
                    <Card className="rounded-2xl border-border/70 shadow-sm">
                        <CardHeader className="pb-4 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <CardTitle className="text-lg">
                                        Riwayat Semua Pesanan
                                    </CardTitle>
                                    <CardDescription>
                                        Cari pelanggan, filter status, dan klik
                                        lapangan untuk optimasi langsung.
                                    </CardDescription>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Cari nama pelanggan, email, lapangan, atau venue..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-full sm:w-[200px] bg-card">
                                        <Filter className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="CONFIRMED">
                                            Terkonfirmasi
                                        </SelectItem>
                                        <SelectItem value="COMPLETED">
                                            Selesai
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            Menunggu Bayar
                                        </SelectItem>
                                        <SelectItem value="CANCELLED">
                                            Dibatalkan
                                        </SelectItem>
                                        <SelectItem value="NO_SHOW">
                                            Tidak Hadir
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Jadwal Main</TableHead>
                                            <TableHead>Pelanggan</TableHead>
                                            <TableHead>
                                                Lapangan & Venue
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Kehadiran</TableHead>
                                            <TableHead className="text-right">
                                                Nominal
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTransactions.map((tx) => {
                                            const badge = STATUS_BADGE[
                                                tx.status
                                            ] ?? {
                                                label: tx.status,
                                                className: "",
                                            };
                                            return (
                                                <TableRow
                                                    key={tx.id}
                                                    className="hover:bg-muted/40"
                                                >
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm">
                                                                {format(
                                                                    new Date(
                                                                        tx.bookingDate
                                                                    ),
                                                                    "dd MMM yyyy",
                                                                    {
                                                                        locale: idLocale,
                                                                    }
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {format(
                                                                    new Date(
                                                                        tx.startTime
                                                                    ),
                                                                    "HH:mm"
                                                                )}{" "}
                                                                –{" "}
                                                                {format(
                                                                    new Date(
                                                                        tx.endTime
                                                                    ),
                                                                    "HH:mm"
                                                                )}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm">
                                                                {
                                                                    tx.user
                                                                        .fullName
                                                                }
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {tx.user.email}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={`/renter/fields/${tx.field.id}?fromVenue=${tx.field.venue.id}`}
                                                            className="group flex flex-col"
                                                        >
                                                            <span className="font-medium text-sm group-hover:text-primary group-hover:underline">
                                                                {tx.field.name}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {
                                                                    tx.field
                                                                        .venue
                                                                        .name
                                                                }
                                                            </span>
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                badge.className
                                                            }
                                                        >
                                                            {badge.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {tx.checkedInAt ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Check-In
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                -
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold tabular-nums">
                                                        {formatCurrency(
                                                            tx.totalPrice
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {filteredTransactions.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="text-center h-28 text-muted-foreground"
                                                >
                                                    Tidak ada pesanan yang
                                                    sesuai dengan filter.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Field Performance (with direct optimization links) */}
                <TabsContent value="field" className="space-y-4">
                    <Card className="rounded-2xl border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Grafik Pendapatan per Lapangan</CardTitle>
                            <CardDescription>
                                Bandingkan kontribusi pendapatan tiap unit
                                lapangan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={filteredFields}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            className="stroke-border/60"
                                        />
                                        <XAxis
                                            dataKey="fieldName"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            width={68}
                                            tickFormatter={(value) =>
                                                formatCompactRp(Number(value))
                                            }
                                        />
                                        <Tooltip
                                            cursor={{
                                                fill: "rgba(0,0,0,0.04)",
                                            }}
                                            contentStyle={{
                                                borderRadius: "10px",
                                                border: "1px solid var(--border)",
                                                backgroundColor: "var(--card)",
                                            }}
                                            formatter={(value) =>
                                                formatCurrency(
                                                    Number(value ?? 0)
                                                )
                                            }
                                            labelFormatter={(
                                                label,
                                                payload
                                            ) => {
                                                if (payload && payload[0]) {
                                                    return `${label} (${payload[0].payload.venueName})`;
                                                }
                                                return label;
                                            }}
                                        />
                                        <Bar
                                            dataKey="totalRevenue"
                                            fill="currentColor"
                                            radius={[6, 6, 0, 0]}
                                            className="fill-primary"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Evaluasi & Optimasi Lapangan</CardTitle>
                            <CardDescription>
                                Klik tombol Kelola untuk mengubah tarif, foto,
                                atau status buka-tutup lapangan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                                            <TableRow key={field.fieldId}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {field.fieldName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {field.venueName}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="tabular-nums">
                                                    {formatCurrency(
                                                        field.pricePerHour
                                                    )}
                                                </TableCell>
                                                <TableCell className="tabular-nums">
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
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            field.isClosed
                                                                ? "border-destructive/25 bg-destructive/10 text-destructive"
                                                                : "border-status-success/25 bg-status-success/10 text-status-success"
                                                        }
                                                    >
                                                        {field.isClosed
                                                            ? "Tutup"
                                                            : "Aktif"}
                                                    </Badge>
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
                                                    Belum ada data lapangan
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Venue Performance */}
                <TabsContent value="venue" className="space-y-4">
                    <Card className="rounded-2xl border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>
                                Grafik Pendapatan per Tempat Olahraga
                            </CardTitle>
                            <CardDescription>
                                Ringkasan performa pendapatan tempat olahraga
                                Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={filteredVenues}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            className="stroke-border/60"
                                        />
                                        <XAxis
                                            dataKey="venueName"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            width={68}
                                            tickFormatter={(value) =>
                                                formatCompactRp(Number(value))
                                            }
                                        />
                                        <Tooltip
                                            cursor={{
                                                fill: "rgba(0,0,0,0.04)",
                                            }}
                                            contentStyle={{
                                                borderRadius: "10px",
                                                border: "1px solid var(--border)",
                                                backgroundColor: "var(--card)",
                                            }}
                                            formatter={(value) =>
                                                formatCurrency(
                                                    Number(value ?? 0)
                                                )
                                            }
                                        />
                                        <Bar
                                            dataKey="totalRevenue"
                                            fill="currentColor"
                                            radius={[6, 6, 0, 0]}
                                            className="fill-primary"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-border/70 shadow-sm">
                        <CardHeader>
                            <CardTitle>Rincian per Tempat Olahraga</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                            <TableRow key={venue.venueId}>
                                                <TableCell className="font-medium">
                                                    {venue.venueName}
                                                </TableCell>
                                                <TableCell>
                                                    {venue.fieldCount} unit
                                                </TableCell>
                                                <TableCell>
                                                    {venue.bookingCount} pesanan
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
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
                                                    Belum ada data pendapatan
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
        </div>
    );
}
