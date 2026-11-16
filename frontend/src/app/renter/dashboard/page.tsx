"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";
import { useRenterStats, useChartData } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { CheckInScannerDialog } from "@/app/renter/bookings/components/CheckInScannerDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowRight,
    Building2,
    CalendarClock,
    CheckCircle2,
    Clock,
    LifeBuoy,
    MapPin,
    Plus,
    Sparkles,
    Trophy,
    Wallet,
} from "lucide-react";

interface TodayScheduleItem {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    checkedInAt: string | null;
    user: {
        fullName: string;
        phoneNumber?: string | null;
    };
    field: {
        name: string;
        venue: {
            name: string;
        };
    };
}

const RANGE_OPTIONS = [
    { value: "7d", label: "7 Hari" },
    { value: "30d", label: "30 Hari" },
    { value: "12m", label: "12 Bulan" },
];

/**
 * Renter Dashboard page.
 * Interactive operations & analytics command center for venue owners.
 */
export default function RenterDashboard() {
    const { user } = useAuth();
    const [range, setRange] = useState("7d");
    const { data: stats, isLoading, error } = useRenterStats();
    const { data: chartData, isLoading: chartLoading } = useChartData(range);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="text-destructive font-medium p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                Gagal memuat statistik pengelola. Silakan muat ulang halaman.
            </div>
        );
    }

    const todaySchedule: TodayScheduleItem[] = stats?.todaySchedule || [];
    const todayFormatted = format(new Date(), "EEEE, dd MMMM yyyy", {
        locale: idLocale,
    });

    return (
        <div className="space-y-8">
            {/* Command Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">
                        <CalendarClock className="h-3.5 w-3.5" />
                        <span>{todayFormatted}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Halo, {user?.fullName || "Pengelola"}!
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base mt-1">
                        Pantau jadwal bermain hari ini, pendapatan, dan performa
                        tempat olahraga Anda.
                    </p>
                </div>

                {/* Operational Quick Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <CheckInScannerDialog />
                    <Link href="/renter/venues">
                        <Button
                            variant="outline"
                            className="gap-2 bg-card hover:bg-muted"
                        >
                            <Plus className="h-4 w-4 text-primary" />
                            Kelola Venue
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Onboarding Guide for New Renters */}
            {stats?.totalVenues === 0 && (
                <Card className="rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Panduan Memulai: Daftarkan Fasilitas Olahraga
                                Anda
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                Selamat bergabung di FieldMax! Agar lapangan
                                Anda dapat ditemukan dan dipesan oleh pelanggan,
                                ikuti 3 langkah mudah berikut:
                            </p>
                        </div>
                        <Link href="/renter/venues">
                            <Button className="shrink-0 font-medium">
                                Tambah Venue Sekarang
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary/10">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">
                                    Buat Profil Venue
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Isi nama tempat, alamat lengkap, dan jam
                                    operasional buka-tutup mingguan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">
                                    Unggah Foto & Lapangan
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Upload minimal 2 foto venue terbaik dan
                                    daftarkan unit lapangan yang disewakan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">
                                    Verifikasi Admin & Mulai
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Ajukan ke tim admin untuk diverifikasi agar
                                    langsung aktif dan siap menerima booking.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* 4 Interactive KPI Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <Link href="/renter/revenue" className="group block">
                    <Card className="h-full rounded-2xl border-border/70 bg-card group-hover:border-primary/50 group-hover:shadow-md transition-all duration-200">
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
                                {formatCurrency(stats?.totalRevenue || 0)}
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    Bulan ini:{" "}
                                    <strong className="text-foreground">
                                        {formatCurrency(
                                            stats?.monthlyRevenue || 0
                                        )}
                                    </strong>
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/renter/bookings" className="group block">
                    <Card className="h-full rounded-2xl border-border/70 bg-card group-hover:border-primary/50 group-hover:shadow-md transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Jadwal Bermain Hari Ini
                            </CardTitle>
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <CalendarClock className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                {stats?.todayBookingsCount || 0}{" "}
                                <span className="text-sm font-normal text-muted-foreground">
                                    sesi
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    <strong className="text-emerald-600 dark:text-emerald-400">
                                        {stats?.checkedInTodayCount || 0}
                                    </strong>{" "}
                                    sudah check-in
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/renter/fields" className="group block">
                    <Card className="h-full rounded-2xl border-border/70 bg-card group-hover:border-primary/50 group-hover:shadow-md transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Lapangan Aktif
                            </CardTitle>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Trophy className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                {stats?.activeFieldsCount ??
                                    stats?.totalFields ??
                                    0}
                                <span className="text-sm font-normal text-muted-foreground">
                                    {" "}
                                    / {stats?.totalFields || 0} unit
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>Total {stats?.totalBookings || 0} pesanan</span>
                                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/renter/venues" className="group block">
                    <Card className="h-full rounded-2xl border-border/70 bg-card group-hover:border-primary/50 group-hover:shadow-md transition-all duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Tempat Olahraga Saya
                            </CardTitle>
                            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                <MapPin className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                                {stats?.totalVenues || 0}
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                {stats?.pendingVenues ? (
                                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                                        {stats.pendingVenues} menunggu verifikasi
                                    </span>
                                ) : (
                                    <span>Semua venue terkelola</span>
                                )}
                                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Middle Row: Interactive Revenue Chart + Today's Live Schedule */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    {chartLoading ? (
                        <Skeleton className="h-[340px] w-full rounded-2xl" />
                    ) : (
                        <RevenueChart
                            data={chartData || []}
                            title="Ikhtisar Pendapatan"
                            headerAction={
                                <div className="inline-flex items-center rounded-full bg-background p-1 border border-border">
                                    {RANGE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setRange(opt.value)}
                                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                                                range === opt.value
                                                    ? "bg-primary text-primary-foreground shadow-2xs"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            }
                        />
                    )}
                </div>

                {/* Today's Live Schedule */}
                <Card className="lg:col-span-3 rounded-2xl border-border/70 shadow-sm flex flex-col">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2 border-b border-border/50">
                        <div>
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Jadwal Bermain Hari Ini
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Pantau kedatangan pelanggan hari ini
                            </p>
                        </div>
                        <Link href="/renter/bookings">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-primary"
                            >
                                Semua
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1">
                        {todaySchedule.length === 0 ? (
                            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center px-4">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <CalendarClock className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-foreground">
                                    Belum ada jadwal bermain hari ini
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                                    Pesanan terkonfirmasi untuk hari ini akan
                                    otomatis muncul di sini.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                                {todaySchedule.map((item) => {
                                    const start = format(
                                        new Date(item.startTime),
                                        "HH:mm"
                                    );
                                    const end = format(
                                        new Date(item.endTime),
                                        "HH:mm"
                                    );
                                    const isCheckedIn = Boolean(
                                        item.checkedInAt
                                    );
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/60 p-3 hover:border-primary/40 transition-colors"
                                        >
                                            <div className="min-w-0 space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                        {start} – {end}
                                                    </span>
                                                    <span className="font-semibold text-sm truncate">
                                                        {item.user.fullName}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {item.field.venue.name} •{" "}
                                                    {item.field.name}
                                                </p>
                                            </div>
                                            {isCheckedIn ? (
                                                <Badge
                                                    variant="outline"
                                                    className="shrink-0 gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                >
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Hadir
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="shrink-0 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                                                >
                                                    Belum Check-In
                                                </Badge>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Recent Bookings + Quick Shortcuts */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RecentBookings
                        bookings={stats?.recentBookings || []}
                        viewAllHref="/renter/bookings"
                    />
                </div>

                <Card className="rounded-2xl border-border/70 shadow-sm h-fit">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">
                            Akses Cepat Mitra
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2.5">
                        <Link
                            href="/renter/venues"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3.5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Tempat Olahraga
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Kelola jadwal & foto venue
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                            href="/renter/fields"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3.5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Unit Lapangan
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Atur tarif & buka-tutup lapangan
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                            href="/renter/revenue"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3.5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Wallet className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Laporan Pendapatan
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Rincian pemasukan per venue
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </Link>

                        <Link
                            href="/renter/reports"
                            className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 p-3.5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <LifeBuoy className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Tiket Bantuan
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Hubungi tim dukungan FieldMax
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

/**
 * Loading skeleton for the Renter Dashboard.
 */
function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[180px] rounded-full" />
                    <Skeleton className="h-8 w-[240px]" />
                    <Skeleton className="h-4 w-[320px]" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-[140px]" />
                    <Skeleton className="h-10 w-[120px]" />
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[130px] rounded-2xl" />
                ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-[340px] rounded-2xl" />
                <Skeleton className="lg:col-span-3 h-[340px] rounded-2xl" />
            </div>
        </div>
    );
}
