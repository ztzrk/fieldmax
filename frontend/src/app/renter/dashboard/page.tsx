"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
    AlertCircle,
    ArrowRight,
    CalendarClock,
    Clock,
    Plus,
    Sparkles,
    Star,
    Trophy,
    Wallet,
} from "lucide-react";
import { CheckInScannerDialog } from "@/app/renter/bookings/components/CheckInScannerDialog";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import {
    type ChartRange,
    RevenueChart,
} from "@/components/dashboard/RevenueChart";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useChartData, useRenterStats } from "@/hooks/useDashboard";
import { cn, formatCurrency, formatTime } from "@/lib/utils";

/**
 * Returns minutes since midnight from HH:mm formatted string.
 */
function parseMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(":").map((part) => parseInt(part, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return -1;
    return h * 60 + m;
}

/**
 * Renter Dashboard page.
 * Operational command center & revenue analytics for venue owners.
 */
export default function RenterDashboard() {
    const { user } = useAuth();
    const [range, setRange] = useState<ChartRange>("7d");
    const { data: stats, isLoading, error } = useRenterStats();
    const { data: chartData, isLoading: chartLoading } = useChartData(range);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error || !stats) {
        return (
            <div className="text-destructive font-medium p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                Gagal memuat statistik mitra. Silakan muat ulang halaman.
            </div>
        );
    }

    const todaySchedule = stats.todaySchedule || [];
    const topFields = stats.topFields || [];
    const todayFormatted = format(new Date(), "EEEE, dd MMMM yyyy", {
        locale: idLocale,
    });

    const now = new Date();
    const currentMinutesOfDay = now.getHours() * 60 + now.getMinutes();

    const needsAttentionCount =
        stats.pendingVenues +
        stats.rejectedVenues +
        stats.pendingFields +
        stats.rejectedFields +
        stats.openReports;

    return (
        <div className="space-y-6">
            {/* Operate Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Halo, {user?.fullName || "Pengelola"}!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                            {todayFormatted}
                        </span>{" "}
                        — Pantau jadwal bermain hari ini, check-in pelanggan, dan
                        performa venue Anda.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <CheckInScannerDialog />
                    <Button
                        variant="outline"
                        asChild
                        className="gap-2 bg-card hover:bg-muted"
                    >
                        <Link href="/renter/venues">
                            <Plus className="h-4 w-4 text-primary" />
                            Kelola Venue
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Onboarding Guide for New Renters */}
            {stats.totalVenues === 0 && (
                <Card className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Panduan Memulai: Daftarkan Fasilitas Olahraga Anda
                            </h2>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                Selamat bergabung di FieldMax! Agar lapangan Anda
                                dapat ditemukan dan dipesan oleh pelanggan, ikuti 3
                                langkah berikut:
                            </p>
                        </div>
                        <Button asChild className="shrink-0 font-medium">
                            <Link href="/renter/venues">
                                Tambah Venue Sekarang
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-primary/15">
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">
                                    Buat Profil Venue
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Isi nama tempat, alamat lengkap, dan jam
                                    operasional mingguan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">
                                    Unggah Foto & Lapangan
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Upload minimal 2 foto venue dan daftarkan
                                    unit lapangan beserta tarif per jam.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">
                                    Verifikasi Admin & Mulai
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Ajukan verifikasi ke admin agar lapangan siap
                                    menerima booking online.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Actionable Verification / Support Alerts */}
            {stats.totalVenues > 0 && needsAttentionCount > 0 && (
                <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/70 bg-card px-4 py-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground mr-1">
                        <AlertCircle
                            className="h-4 w-4 text-status-warning shrink-0"
                            aria-hidden="true"
                        />
                        <span>Perlu Perhatian:</span>
                    </div>

                    {stats.rejectedVenues > 0 && (
                        <Link
                            href="/renter/venues?status=REJECTED"
                            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/25 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/15 transition-colors"
                        >
                            {stats.rejectedVenues} venue ditolak
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    )}

                    {stats.pendingVenues > 0 && (
                        <Link
                            href="/renter/venues?status=PENDING"
                            className="inline-flex items-center gap-1.5 rounded-md border border-status-warning/25 bg-status-warning/10 px-2.5 py-1 text-xs font-medium text-status-warning hover:bg-status-warning/15 transition-colors"
                        >
                            {stats.pendingVenues} venue menunggu verifikasi
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    )}

                    {stats.rejectedFields > 0 && (
                        <Link
                            href="/renter/fields?status=REJECTED"
                            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/25 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/15 transition-colors"
                        >
                            {stats.rejectedFields} lapangan ditolak
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    )}

                    {stats.pendingFields > 0 && (
                        <Link
                            href="/renter/fields?status=PENDING"
                            className="inline-flex items-center gap-1.5 rounded-md border border-status-warning/25 bg-status-warning/10 px-2.5 py-1 text-xs font-medium text-status-warning hover:bg-status-warning/15 transition-colors"
                        >
                            {stats.pendingFields} lapangan menunggu verifikasi
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    )}

                    {stats.openReports > 0 && (
                        <Link
                            href="/renter/reports"
                            className="inline-flex items-center gap-1.5 rounded-md border border-status-info/25 bg-status-info/10 px-2.5 py-1 text-xs font-medium text-status-info hover:bg-status-info/15 transition-colors"
                        >
                            {stats.openReports} tiket bantuan aktif
                            <ArrowRight className="h-3 w-3" />
                        </Link>
                    )}
                </div>
            )}

            {/* Tier 1: 4 Operational KPI Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardKpiCard
                    title="Total Pendapatan"
                    value={formatCurrency(stats.totalRevenue)}
                    valueTone="primary"
                    icon={Wallet}
                    iconTone="primary"
                    deltaPct={stats.revenueDeltaPct}
                    subtitle={
                        <span>
                            Bulan ini:{" "}
                            <strong className="text-foreground tabular-nums">
                                {formatCurrency(stats.monthlyRevenue)}
                            </strong>
                        </span>
                    }
                    href="/renter/revenue"
                />

                <DashboardKpiCard
                    title="Jadwal Bermain Hari Ini"
                    value={stats.todayBookingsCount}
                    unit="sesi"
                    icon={CalendarClock}
                    iconTone="info"
                    subtitle={
                        <span>
                            <strong className="text-status-success tabular-nums">
                                {stats.checkedInTodayCount}
                            </strong>{" "}
                            dari{" "}
                            <strong className="text-foreground tabular-nums">
                                {stats.todayBookingsCount}
                            </strong>{" "}
                            sudah check-in
                        </span>
                    }
                    href="/renter/bookings"
                />

                <DashboardKpiCard
                    title="Lapangan Aktif"
                    value={stats.activeFieldsCount}
                    unit={`/ ${stats.totalFields} unit`}
                    icon={Trophy}
                    iconTone="success"
                    deltaPct={stats.bookingDeltaPct}
                    subtitle={
                        <span>
                            Total{" "}
                            <strong className="text-foreground tabular-nums">
                                {stats.totalBookings}
                            </strong>{" "}
                            pesanan tercatat
                        </span>
                    }
                    href="/renter/fields?status=APPROVED&isClosed=false"
                />

                <DashboardKpiCard
                    title="Rating & Reputasi"
                    value={
                        stats.totalReviews > 0
                            ? stats.averageRating.toFixed(1)
                            : "—"
                    }
                    unit={stats.totalReviews > 0 ? "/ 5.0" : undefined}
                    icon={Star}
                    iconTone="warning"
                    subtitle={
                        <span>
                            <strong className="text-foreground tabular-nums">
                                {stats.totalReviews}
                            </strong>{" "}
                            ulasan •{" "}
                            <strong className="text-foreground tabular-nums">
                                {stats.approvedVenues}/{stats.totalVenues}
                            </strong>{" "}
                            venue aktif
                        </span>
                    }
                    href="/renter/venues"
                />
            </div>

            {/* Tier 2: Interactive Revenue Chart + Today's Live Schedule */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    {chartLoading ? (
                        <Skeleton className="h-[370px] w-full rounded-xl" />
                    ) : (
                        <RevenueChart
                            data={chartData || []}
                            title="Grafik Pendapatan"
                            range={range}
                            onRangeChange={setRange}
                        />
                    )}
                </div>

                {/* Today's Live Schedule */}
                <Card className="lg:col-span-5 rounded-xl border border-border/70 bg-card flex flex-col">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 border-b border-border/50">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Clock
                                    className="h-4 w-4 text-primary"
                                    aria-hidden="true"
                                />
                                Jadwal Bermain Hari Ini
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                                {stats.checkedInTodayCount} hadir dari{" "}
                                {stats.todayBookingsCount} sesi terkonfirmasi
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 text-xs text-primary"
                        >
                            <Link href="/renter/bookings">Semua</Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="pt-4 flex-1">
                        {todaySchedule.length === 0 ? (
                            <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-8">
                                <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <CalendarClock
                                        className="h-5 w-5 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <p className="text-sm font-medium text-foreground">
                                    Belum ada jadwal bermain hari ini
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                                    Pesanan terkonfirmasi untuk hari ini akan
                                    otomatis muncul di daftar ini.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                                {todaySchedule.map((item) => {
                                    const start = formatTime(item.startTime);
                                    const end = formatTime(item.endTime);
                                    const startMin = parseMinutes(start);
                                    const endMin = parseMinutes(end);
                                    const isOngoing =
                                        startMin >= 0 &&
                                        endMin >= 0 &&
                                        currentMinutesOfDay >= startMin &&
                                        currentMinutesOfDay < endMin;
                                    const isCheckedIn = Boolean(
                                        item.checkedInAt
                                    );

                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/renter/bookings?search=${encodeURIComponent(item.user.fullName)}`}
                                            className={cn(
                                                "flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors",
                                                isOngoing
                                                    ? "border-primary/40 bg-primary/5 hover:border-primary/60"
                                                    : "border-border/60 bg-background/60 hover:border-primary/40"
                                            )}
                                        >
                                            <div className="min-w-0 space-y-0.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded tabular-nums shrink-0">
                                                        {start} – {end}
                                                    </span>
                                                    <span className="font-semibold text-sm truncate">
                                                        {item.user.fullName}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {item.field.venue.name} •{" "}
                                                    {item.field.name}
                                                    {item.user.phoneNumber
                                                        ? ` • ${item.user.phoneNumber}`
                                                        : ""}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {isOngoing && !isCheckedIn && (
                                                    <StatusBadge
                                                        label="Berlangsung"
                                                        tone="info"
                                                        dot
                                                        pulseDot
                                                    />
                                                )}
                                                {isCheckedIn ? (
                                                    <StatusBadge
                                                        label="Hadir"
                                                        tone="success"
                                                        dot
                                                    />
                                                ) : (
                                                    <StatusBadge
                                                        label="Belum Check-In"
                                                        tone="warning"
                                                    />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tier 3: Recent Bookings + Top Performing Fields */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <RecentBookings
                        bookings={stats.recentBookings || []}
                        viewAllHref="/renter/bookings"
                        getDetailHref={(booking) =>
                            `/renter/bookings?search=${encodeURIComponent(booking.user.fullName)}`
                        }
                    />
                </div>

                <Card className="lg:col-span-5 rounded-xl border border-border/70 bg-card flex flex-col">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 border-b border-border/50">
                        <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Trophy
                                    className="h-4 w-4 text-primary"
                                    aria-hidden="true"
                                />
                                Performa Lapangan Teratas
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Kontributor pendapatan tertinggi milik Anda
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 gap-1 text-xs text-primary hover:text-primary"
                        >
                            <Link href="/renter/revenue">
                                Rincian
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </CardHeader>

                    <CardContent className="pt-4 flex-1">
                        {topFields.length === 0 ? (
                            <div className="min-h-[200px] flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-6">
                                <Trophy
                                    className="h-5 w-5 text-muted-foreground mb-2"
                                    aria-hidden="true"
                                />
                                <p className="text-sm font-medium text-foreground">
                                    Belum ada unit lapangan terdaftar
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                                    Tambahkan lapangan pada venue Anda untuk mulai
                                    memantau performa pendapatan.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {topFields.map((field) => (
                                    <Link
                                        key={field.id}
                                        href={`/renter/fields?search=${encodeURIComponent(field.name)}`}
                                        className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 p-3 hover:border-primary/40 transition-colors"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-foreground truncate">
                                                    {field.name}
                                                </span>
                                                {field.isClosed ? (
                                                    <StatusBadge
                                                        label="Tutup"
                                                        tone="neutral"
                                                    />
                                                ) : field.status !== "APPROVED" ? (
                                                    <StatusBadge
                                                        label={
                                                            field.status ===
                                                            "PENDING"
                                                                ? "Menunggu"
                                                                : "Ditolak"
                                                        }
                                                        tone={
                                                            field.status ===
                                                            "PENDING"
                                                                ? "warning"
                                                                : "destructive"
                                                        }
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                                <span className="truncate">
                                                    {field.venueName}
                                                </span>
                                                <span aria-hidden="true">•</span>
                                                <span className="tabular-nums">
                                                    {field.bookingCount} transaksi
                                                </span>
                                                {field.reviewCount > 0 && (
                                                    <>
                                                        <span aria-hidden="true">
                                                            •
                                                        </span>
                                                        <span className="inline-flex items-center gap-0.5 tabular-nums text-foreground font-medium">
                                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                            {field.avgRating}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-primary tabular-nums">
                                                {formatCurrency(field.revenue)}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground tabular-nums">
                                                {formatCurrency(field.pricePerHour)}
                                                /jam
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/**
 * Loading skeleton matching the 3-tier Renter Dashboard layout.
 */
function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[240px]" />
                    <Skeleton className="h-4 w-[380px] max-w-full" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-[140px] rounded-md" />
                    <Skeleton className="h-10 w-[130px] rounded-md" />
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[132px] rounded-xl" />
                ))}
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
                <Skeleton className="lg:col-span-7 h-[370px] rounded-xl" />
                <Skeleton className="lg:col-span-5 h-[370px] rounded-xl" />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
                <Skeleton className="lg:col-span-7 h-[310px] rounded-xl" />
                <Skeleton className="lg:col-span-5 h-[310px] rounded-xl" />
            </div>
        </div>
    );
}
