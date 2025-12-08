"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                let targetDashboard = "/";
                if (user.role === "ADMIN") {
                    targetDashboard = "/admin/dashboard";
                } else if (user.role === "RENTER") {
                    targetDashboard = "/renter/dashboard";
                }
                router.replace(targetDashboard);
            } else {
                router.replace("/login");
            }
        }
    }, [user, isLoading, router]);

    return <></>;
}
