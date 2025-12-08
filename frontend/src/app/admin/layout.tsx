"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AdminSidebar } from "./components/sidebar";
import { Header } from "@/components/shared/header";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <div className="flex flex-1 flex-col sm:border-l">
                <Header />
                <main className="flex-1 p-4 pt-6 md:p-8">{children}</main>
            </div>
        </SidebarProvider>
    );
}
