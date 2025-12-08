"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RenterSidebar } from "./components/sidebar";
import { Header } from "@/components/shared/header";

export default function RenterLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (!user) {
            router.push("/login");
            return;
        }
        if (user.role !== "RENTER") {
            router.push("/");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== "RENTER") {
        return <FullScreenLoader />;
    }

    return (
        <SidebarProvider>
            <RenterSidebar />

            <div className="flex flex-1 flex-col sm:border-l">
                <Header />
                <main className="flex-1 p-4 pt-6 md:p-8">{children}</main>
            </div>
        </SidebarProvider>
    );
}
