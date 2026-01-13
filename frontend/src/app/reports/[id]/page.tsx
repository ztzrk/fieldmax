"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ReportDetailView } from "../components/ReportDetailView";

export default function ReportDetailPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8 mt-4">
                <ReportDetailView backUrl="/reports" />
            </main>
        </div>
    );
}
