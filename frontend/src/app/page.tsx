"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && user) {
            let targetDashboard = "/";
            if (user.role === "ADMIN") {
                targetDashboard = "/admin/dashboard";
            } else if (user.role === "RENTER") {
                targetDashboard = "/renter/dashboard";
            }
            router.replace(targetDashboard);
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (user) {
        return null; // Will redirect
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
            <h1 className="mb-4 text-4xl font-bold">Welcome to FieldMax</h1>
            <p className="mb-8 text-lg text-muted-foreground">
                Manage your sports venues and fields efficiently.
            </p>
            <Link href="/login">
                <Button size="lg">Login</Button>
            </Link>
        </div>
    );
}
