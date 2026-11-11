"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAdminStats } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { AdminPageWrapper } from "@/components/shared/pages/AdminPageWrapper";

/**
 * Admin Dashboard page.
 * Displays key statistics about the application (Users, Venues, Fields, etc.).
 * Includes a logout confirmation.
 */
export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [range, setRange] = useState("7d");
    const { data, isLoading, error } = useAdminStats();

    // Safely access nested data only when loaded
    const stats = data?.stats;
    const chartData = data?.chartData ? (data.chartData as any)[range] : [];

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="text-destructive font-medium p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                Gagal memuat statistik dashboard. Silakan muat ulang halaman.
            </div>
        );
    }

    const pageActions = <DateRangeFilter value={range} onChange={setRange} />;

    return (
        <AdminPageWrapper
            title="Dashboard Admin"
            subtitle="Ringkasan kinerja platform dan aktivitas persewaan"
            actions={pageActions}
        >
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pengguna
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                            {stats?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akun terdaftar di platform
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Tempat Olahraga
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <MapPin className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight text-foreground">
                            {stats?.totalVenues || 0}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Venue terdaftar di platform
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Lapangan Aktif
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
                            Total lapangan siap dipesan
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
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                            }).format(stats?.totalRevenue || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akumulasi pendapatan transaksi
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
                    </div>
                    {isLoading ? (
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    ) : (
                        <RevenueChart data={chartData || []} />
                    )}
                </div>
                <div className="col-span-1 lg:col-span-3 space-y-4">
                    <RecentBookings bookings={stats?.recentBookings || []} />
                    <Card className="rounded-xl border border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Statistik Cepat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Menunggu Verifikasi
                                </span>
                                <span className="font-bold text-amber-600 dark:text-amber-400">
                                    {stats?.pendingVenues || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Lapangan Aktif
                                </span>
                                <span className="font-bold text-foreground">
                                    {stats?.totalFields || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminPageWrapper>
    );
}

/**
 * Loading skeleton for the Admin Dashboard.
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
