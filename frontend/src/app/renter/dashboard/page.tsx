"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useRenterStats, useChartData } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trophy, Clock, Calendar, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";

/**
 * Renter Dashboard page.
 * Displays statistics about the renter's venues, fields, and bookings.
 * Includes a logout confirmation.
 */
export default function RenterDashboard() {
    const { user, logout } = useAuth();
    const [range, setRange] = useState("7d");
    const { data: stats, isLoading, error } = useRenterStats();
    const { data: chartData, isLoading: chartLoading } = useChartData(range);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="text-destructive font-medium p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                Gagal memuat statistik pengelola. Silakan muat ulang halaman.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard Pengelola
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Selamat datang kembali,{" "}
                        <span className="font-semibold text-foreground">
                            {user?.fullName || "Pengelola"}
                        </span>
                        !
                    </p>
                </div>
                <ConfirmationDialog
                    trigger={<Button variant="destructive">Keluar</Button>}
                    title="Konfirmasi Keluar"
                    description="Anda akan keluar dari akun. Apakah Anda yakin ingin melanjutkan?"
                    onConfirm={logout}
                />
            </div>

            {stats?.totalVenues === 0 && (
                <Card className="rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Panduan Memulai: Daftarkan Fasilitas Olahraga Anda
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                Selamat bergabung di FieldMax! Agar lapangan Anda dapat ditemukan dan dipesan oleh pelanggan, ikuti 3 langkah mudah berikut:
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
                                <h4 className="font-semibold text-sm">Buat Profil Venue</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Isi nama tempat, alamat lengkap, dan jam operasional buka-tutup mingguan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Unggah Foto & Lapangan</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Upload minimal 2 foto venue terbaik dan daftarkan unit lapangan yang disewakan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Verifikasi Admin & Mulai</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Ajukan ke tim admin untuk diverifikasi agar langsung aktif dan siap menerima booking.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tempat Olahraga Saya
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                            <MapPin className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                            {stats?.totalVenues || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Venue milik Anda
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Lapangan Saya
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Trophy className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                            {stats?.totalFields || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total lapangan di venue Anda
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Menunggu Persetujuan
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
                            <Clock className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                            {stats?.pendingVenues || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Menunggu verifikasi admin
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pendapatan
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                            <span className="text-xs font-bold">Rp</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight text-primary">
                            {formatCurrency(stats?.totalRevenue || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akumulasi pendapatan persewaan
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <div className="col-span-1 lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">
                            Ikhtisar Pendapatan
                        </h2>
                        <DateRangeFilter value={range} onChange={setRange} />
                    </div>
                    {chartLoading ? (
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    ) : (
                        <RevenueChart data={chartData || []} />
                    )}
                </div>
                <div className="col-span-1 lg:col-span-3 space-y-4">
                    <RecentBookings bookings={stats?.recentBookings || []} />
                </div>
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
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
            </div>
        </div>
    );
}
