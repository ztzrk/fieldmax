"use client";

import { ReportsView } from "@/app/reports/components/ReportsView";

export default function RenterReportsPage() {
    return (
        <ReportsView
            basePath="/renter/reports"
            title="Support Tickets"
            subtitle="Manage your support requests and issues."
        />
    );
}
