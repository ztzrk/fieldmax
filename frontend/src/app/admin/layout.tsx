import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AdminSidebar } from "./components/sidebar";
import { Header } from "@/components/shared/header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleGuard } from "@/components/auth/RoleGuard";

/**
 * Root layout for the Admin module.
 * Protects routes with AuthGuard and RoleGuard (ADMIN role).
 * Wraps content with the SidebarProvider and renders the header and main content area.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <RoleGuard role="ADMIN">
                <SidebarProvider>
                    <AdminSidebar />
                    <div className="flex flex-1 flex-col sm:border-l">
                        <Header />
                        <main className="flex-1 p-4 pt-6 md:p-8">
                            {children}
                        </main>
                    </div>
                </SidebarProvider>
            </RoleGuard>
        </AuthGuard>
    );
}
