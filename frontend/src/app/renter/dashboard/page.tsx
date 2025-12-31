"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { useRenterStats } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trophy, Clock, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renter Dashboard page.
 * Displays statistics about the renter's venues, fields, and bookings.
 * Includes a logout confirmation.
 */
export default function RenterDashboard() {
    const { user, logout } = useAuth();
    const { data: stats, isLoading, error } = useRenterStats();

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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            My Venues
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalVenues || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Venues you own
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            My Fields
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalFields || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Fields across your venues
                        </p>
                    </CardContent>
                </Card>
                <Card>
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
                            Waiting for admin approval
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bookings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalBookings || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            All time bookings
                        </p>
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
