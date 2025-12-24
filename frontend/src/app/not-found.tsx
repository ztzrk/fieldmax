"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
    const { user, isLoading } = useAuth();

    let dashboardLink = "/";
    if (user?.role === "ADMIN") {
        dashboardLink = "/admin/dashboard";
    } else if (user?.role === "RENTER") {
        dashboardLink = "/renter/dashboard";
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center space-y-4 bg-background text-center">
            <h1 className="text-4xl font-bold">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground">
                Sorry, the page you are looking for does not exist.
            </p>

            {!isLoading && (
                <div className="pt-4">
                    {user ? (
                        <Link href={dashboardLink}>
                            <Button size="lg">Back to Dashboard</Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button size="lg">Go to Login</Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
