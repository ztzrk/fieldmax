import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RenterSidebar } from "./components/sidebar";
import { Header } from "@/components/shared/header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function RenterLayout({ children }: { children: ReactNode }) {
    return (
        <AuthGuard>
            <RoleGuard role="RENTER">
                <SidebarProvider>
                    <RenterSidebar />

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
