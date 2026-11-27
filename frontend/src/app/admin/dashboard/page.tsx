"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    CalendarCheck2,
    CheckCircle2,
    MessageSquareWarning,
    Swords,
    Trophy,
    Users,
    Wallet,
} from "lucide-react";
import { DashboardKpiCard } from "@/components/dashboard/DashboardKpiCard";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import {
    type ChartRange,
    RevenueChart,
} from "@/components/dashboard/RevenueChart";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";
import {
    BOOKING_STATUS_META,
    STATUS_DOT_STYLES,
} from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/useDashboard";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Admin Dashboard page.
 * Structured in a 3-tier Operate hierarchy:
 * 1) Exception-driven moderation queue strip
 * 2) Macro KPI cards with month-over-month deltas
 * 3) Interactive revenue/transaction trends, status & sport distributions, and recent bookings
 */
export default function AdminDashboard() {
    const [range, setRange] = useState<ChartRange>("7d");
    const { data, isLoading, error } = useAdminStats();

    const stats = data?.stats;
    const chartData = data?.chartData ? data.chartData[range] : [];

    const totalBreakdownBookings = useMemo(() => {
        if (!stats?.bookingStatusBreakdown?.length) return 0;
        return stats.bookingStatusBreakdown.reduce(
            (sum, item) => sum + item.count,
            0
        );
    }, [stats?.bookingStatusBreakdown]);

    const maxSportFieldCount = useMemo(() => {
        if (!stats?.topSportTypes?.length) return 1;
        return Math.max(...stats.topSportTypes.map((s) => s.fieldCount), 1);
    }, [stats?.topSportTypes]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error || !stats) {
        return (
            <AdminPageWrapper
                title="Dashboard Admin"
                subtitle="Ringkasan kinerja ekosistem dan aktivitas persewaan"
            >
                <div className="text-destructive font-medium p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    Gagal memuat statistik dashboard. Silakan muat ulang halaman.
                </div>
            </AdminPageWrapper>
        );
    }

    const totalModerationQueue =
        stats.pendingVenues + stats.pendingFields + stats.openReports;

    const actionItems = [
        {
            label: "Venue Menunggu Verifikasi",
            count: stats.pendingVenues,
            href: "/admin/venues?status=PENDING",
            icon: Building2,
            tone: "warning" as const,
        },
        {
            label: "Lapangan Menunggu Verifikasi",
            count: stats.pendingFields,
            href: "/admin/fields?status=PENDING",
            icon: Trophy,
            tone: "warning" as const,
        },
        {
            label: "Laporan & Tiket Terbuka",
            count: stats.openReports,
            href: "/admin/reports?status=PENDING,IN_PROGRESS",
            icon: MessageSquareWarning,
            tone: "destructive" as const,
        },
    ].filter((item) => item.count > 0);

    return (
        <AdminPageWrapper
            title="Dashboard Admin"
            subtitle="Pantau kesehatan ekosistem, antrean moderasi, dan performa transaksi platform"
            actions={
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                    <Link href="/admin/bookings">
                        Kelola Pemesanan
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            }
        >
            {/* Exception-Driven Moderation Strip */}
            {totalModerationQueue > 0 ? (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
                    {actionItems.map((item) => {
                        const Icon = item.icon;
                        const isDestructive = item.tone === "destructive";
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className={cn(
                                            "p-2 rounded-lg shrink-0",
                                            isDestructive
                                                ? "bg-destructive/10 text-destructive"
                                                : "bg-status-warning/10 text-status-warning"
                                        )}
                                    >
                                        <Icon
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground truncate">
                                            {item.label}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground tabular-nums">
                                            {item.count} perlu ditinjau
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card px-4 py-2.5 text-xs text-muted-foreground">
                    <CheckCircle2
                        className="h-4 w-4 text-status-success shrink-0"
                        aria-hidden="true"
                    />
                    <span>
                        Semua antrean moderasi bersih — tidak ada pengajuan venue,
                        lapangan, atau tiket laporan yang tertunda.
                    </span>
                </div>
            )}

            {/* Tier 1: Macro KPI Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardKpiCard
                    title="Total Pendapatan (GMV)"
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
                    href="/admin/bookings?paymentStatus=PAID"
                />

                <DashboardKpiCard
                    title="Total Pemesanan"
                    value={stats.totalBookings}
                    unit="pesanan"
                    icon={CalendarCheck2}
                    iconTone="info"
                    deltaPct={stats.bookingDeltaPct}
                    subtitle={
                        <span>
                            Hari ini:{" "}
                            <strong className="text-foreground tabular-nums">
                                {stats.todayBookingsCount}
                            </strong>{" "}
                            jadwal • Bulan ini:{" "}
                            <strong className="text-foreground tabular-nums">
                                {stats.bookingsThisMonth}
                            </strong>
                        </span>
                    }
                    href="/admin/bookings"
                />

                <DashboardKpiCard
                    title="Lapangan Siap Pakai"
                    value={stats.activeFields}
                    unit={`/ ${stats.totalFields} unit`}
                    icon={Trophy}
                    iconTone="success"
                    subtitle={
                        <span>
                            <strong className="text-foreground tabular-nums">
                                {stats.approvedVenues}/{stats.totalVenues}
                            </strong>{" "}
                            venue disetujui platform
                        </span>
                    }
                    href="/admin/fields?status=APPROVED&isClosed=false"
                />

                <DashboardKpiCard
                    title="Total Pengguna"
                    value={stats.totalUsers}
                    unit="akun"
                    icon={Users}
                    iconTone="neutral"
                    deltaPct={stats.userDeltaPct}
                    subtitle={
                        <span>
                            {stats.regularUsersCount} Penyewa •{" "}
                            {stats.rentersCount} Mitra
                        </span>
                    }
                    href="/admin/users"
                />
            </div>

            {/* Tier 2: Core Trend Chart + Platform Breakdown */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    <RevenueChart
                        data={chartData || []}
                        title="Grafik Pendapatan & Transaksi"
                        range={range}
                        onRangeChange={setRange}
                    />
                </div>

                <Card className="lg:col-span-4 rounded-xl border border-border/70 bg-card flex flex-col">
                    <CardHeader className="pb-3 border-b border-border/50">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Swords
                                className="h-4 w-4 text-primary"
                                aria-hidden="true"
                            />
                            Distribusi Ekosistem
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Komposisi status pemesanan dan cabang olahraga aktif
                        </p>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6 flex-1">
                        {/* Booking Status Breakdown */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                <span>Status Pemesanan</span>
                                <span className="tabular-nums">
                                    Total {totalBreakdownBookings}
                                </span>
                            </div>

                            {stats.bookingStatusBreakdown.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    Belum ada data status pemesanan.
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {stats.bookingStatusBreakdown.map((item) => {
                                        const meta = BOOKING_STATUS_META[
                                            item.status
                                        ] ?? {
                                            label: item.status,
                                            tone: "neutral" as const,
                                        };
                                        const pct =
                                            totalBreakdownBookings > 0
                                                ? Math.round(
                                                      (item.count /
                                                          totalBreakdownBookings) *
                                                          100
                                                  )
                                                : 0;
                                        return (
                                            <Link
                                                key={item.status}
                                                href={`/admin/bookings?status=${item.status}`}
                                                className="block space-y-1 group"
                                            >
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="inline-flex items-center gap-2 text-foreground group-hover:text-primary transition-colors">
                                                        <span
                                                            className={cn(
                                                                "h-2 w-2 rounded-full shrink-0",
                                                                STATUS_DOT_STYLES[
                                                                    meta.tone
                                                                ]
                                                            )}
                                                        />
                                                        {meta.label}
                                                    </span>
                                                    <span className="font-medium text-muted-foreground tabular-nums">
                                                        {item.count}{" "}
                                                        <span className="text-[11px] opacity-75">
                                                            ({pct}%)
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all",
                                                            STATUS_DOT_STYLES[
                                                                meta.tone
                                                            ]
                                                        )}
                                                        style={{
                                                            width: `${pct}%`,
                                                        }}
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Top Sport Types */}
                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                                <span>Cabang Olahraga Populer</span>
                                <Link
                                    href="/admin/sport-types"
                                    className="text-primary hover:underline"
                                >
                                    Kelola
                                </Link>
                            </div>

                            {stats.topSportTypes.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    Belum ada cabang olahraga terdaftar.
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {stats.topSportTypes.map((sport) => {
                                        const barPct = Math.round(
                                            (sport.fieldCount /
                                                maxSportFieldCount) *
                                                100
                                        );
                                        return (
                                            <Link
                                                key={sport.id}
                                                href={`/admin/fields?sportTypeId=${sport.id}`}
                                                className="block space-y-1 group"
                                            >
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                                        {sport.name}
                                                    </span>
                                                    <span className="text-muted-foreground tabular-nums shrink-0">
                                                        {sport.fieldCount}{" "}
                                                        lapangan
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-primary/80"
                                                        style={{
                                                            width: `${barPct}%`,
                                                        }}
                                                    />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tier 3: Recent Platform Transactions */}
            <RecentBookings
                bookings={stats.recentBookings || []}
                viewAllHref="/admin/bookings"
                getDetailHref={(booking) => `/admin/bookings/${booking.id}`}
            />
        </AdminPageWrapper>
    );
}

/**
 * Loading skeleton matching the 3-tier Admin Dashboard structure to prevent CLS.
 */
function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-[210px]" />
                    <Skeleton className="h-4 w-[360px] max-w-full" />
                </div>
                <Skeleton className="h-9 w-[148px] rounded-md" />
            </div>

            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-[62px] rounded-xl" />
                ))}
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[132px] rounded-xl" />
                ))}
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-12">
                <Skeleton className="lg:col-span-8 h-[370px] rounded-xl" />
                <Skeleton className="lg:col-span-4 h-[370px] rounded-xl" />
            </div>

            <Skeleton className="h-[310px] rounded-xl" />
        </div>
    );
}
