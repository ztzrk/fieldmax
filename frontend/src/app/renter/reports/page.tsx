"use client";

import { ReportsView } from "@/app/reports/components/ReportsView";

export default function RenterReportsPage() {
    return (
        <ReportsView
            basePath="/renter/reports"
            title="Tiket Bantuan"
            subtitle="Kelola permintaan bantuan dan kendala Anda."
        />
    );
}
