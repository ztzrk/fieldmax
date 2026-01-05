"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useAdminStats, useChartData } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Trophy, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";

/**
 * Admin Dashboard page.
 * Displays key statistics about the application (Users, Venues, Fields, etc.).
 * Includes a logout confirmation.
 */
export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [range, setRange] = useState("7d");
    const { data: stats, isLoading, error } = useAdminStats();
    const { data: chartData, isLoading: chartLoading } = useChartData(range);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="text-red-500">
                Failed to load dashboard statistics.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-xl border-none shadow-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-blue-100/80">
                            Registered accounts
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border-none shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-violet-100">
                            Total Venues
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-violet-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalVenues || 0}
                        </div>
                        <p className="text-xs text-violet-100/80">
                            All venues registered
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border-none shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-100">
                            Active Fields
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-emerald-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalFields || 0}
                        </div>
                        <p className="text-xs text-emerald-100/80">
                            Total fields available
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border-none shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-100">
                            Total Revenue
                        </CardTitle>
                        <span className="text-amber-100 font-bold">Rp</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                            }).format(stats?.totalRevenue || 0)}
                        </div>
                        <p className="text-xs text-amber-100/80">
                            Lifetime revenue
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                <div className="col-span-1 lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">
                            Revenue Overview
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
                    <Card className="rounded-xl border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Pending Venues
                                </span>
                                <span className="font-bold">
                                    {stats?.pendingVenues || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Active Fields
                                </span>
                                <span className="font-bold">
                                    {stats?.totalFields || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
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
