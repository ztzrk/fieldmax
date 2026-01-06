"use client";

import { renterNavItems } from "@/config/renter-dashboard";
import { AppSidebar } from "@/components/shared/AppSidebar";

/**
 * Sidebar navigation component for the Renter dashboard.
 * Displays navigation links defined in the renter configuration.
 */
export function RenterSidebar() {
    return (
        <AppSidebar
            items={renterNavItems}
            consoleTitle="Renter Console"
            userRoleLabel="Renter"
        />
    );
}
