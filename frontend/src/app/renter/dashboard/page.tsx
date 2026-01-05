"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useRenterStats, useChartData } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trophy, Clock, Calendar } from "lucide-react";
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
                        Renter Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back,{" "}
                        <span className="font-semibold">
                            {user?.fullName || "Renter"}
                        </span>
                        !
                    </p>
                </div>
                <ConfirmationDialog
                    trigger={<Button variant="destructive">Logout</Button>}
                    title="Logout Confirmation"
                    description="You are about to log out. Are you sure you want to proceed?"
                    onConfirm={logout}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-violet-100">
                            My Venues
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-violet-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalVenues || 0}
                        </div>
                        <p className="text-xs text-violet-100/80">
                            Venues you own
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-100">
                            My Fields
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-emerald-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalFields || 0}
                        </div>
                        <p className="text-xs text-emerald-100/80">
                            Fields across your venues
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-pink-100">
                            Pending Venues
                        </CardTitle>
                        <Clock className="h-4 w-4 text-pink-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.pendingVenues || 0}
                        </div>
                        <p className="text-xs text-pink-100/80">
                            Waiting for admin approval
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-xl transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-amber-100">
                            Total Revenue
                        </CardTitle>
                        <span className="text-amber-100 font-bold">Rp</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats?.totalRevenue || 0)}
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
