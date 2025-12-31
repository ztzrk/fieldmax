"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { FullScreenLoader } from "@/components/FullScreenLoader";

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!user) {
        return <FullScreenLoader />; // Keep showing loader while redirecting
    }

    return <>{children}</>;
}
