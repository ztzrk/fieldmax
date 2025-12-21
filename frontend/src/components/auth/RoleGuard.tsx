"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { FullScreenLoader } from "@/components/FullScreenLoader";

interface RoleGuardProps {
    children: ReactNode;
    role: "ADMIN" | "RENTER" | "USER";
}

export function RoleGuard({ children, role }: RoleGuardProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user && user.role !== role) {
            router.push("/");
        }
    }, [user, isLoading, router, role]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!user || user.role !== role) {
        return <FullScreenLoader />; // Keep showing loader while redirecting
    }

    return <>{children}</>;
}
