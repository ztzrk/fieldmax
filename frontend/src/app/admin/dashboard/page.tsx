"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useAdminStats } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Trophy, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Admin Dashboard page.
 * Displays key statistics about the application (Users, Venues, Fields, etc.).
 * Includes a logout confirmation.
 */
export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const { data: stats, isLoading, error } = useAdminStats();

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
                <Card className="rounded-xl border-border/50 shadow-sm transition-all hover:bg-sidebar-accent/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Registered accounts
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border-border/50 shadow-sm transition-all hover:bg-sidebar-accent/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Venues
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalVenues || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            All venues registered
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border-border/50 shadow-sm transition-all hover:bg-sidebar-accent/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Fields
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalFields || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total fields available
                        </p>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border-border/50 shadow-sm transition-all hover:bg-sidebar-accent/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Venues
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.pendingVenues || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>
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
