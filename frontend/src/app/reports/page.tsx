"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ReportsView } from "./components/ReportsView";

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-900">
            {/* Hero Section */}

            <main className="container mx-auto max-w-6xl px-4 py-8">
                <ReportsView />
            </main>
        </div>
    );
}
