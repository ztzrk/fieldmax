"use client";

import { adminNavItems } from "@/config/admin-dashboard";
import { AppSidebar } from "@/components/shared/AppSidebar";

/**
 * Sidebar navigation component for the Admin dashboard.
 * Displays navigation links defined in the admin configuration.
 */
export function AdminSidebar() {
    return (
        <AppSidebar
            items={adminNavItems}
            consoleTitle="Admin Console"
            userRoleLabel="Admin"
        />
    );
}
