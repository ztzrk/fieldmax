"use client";

import { useEffect, useState } from "react";
import { Report, reportsService } from "@/services/reports.service";
import { CreateReportForm } from "./components/create-report-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    Loader2,
    MessageSquare,
    Clock,
    CheckCircle2,
    ChevronRight,
    Search,
    Filter,
} from "lucide-react";
import { format } from "date-fns";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const router = useRouter();

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const data = await reportsService.getMyReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = reports.filter((report) => {
        const matchesSearch = report.subject
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "ALL" || report.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-900">
            {/* Hero Section */}
            <div className="bg-white dark:bg-zinc-800 border-b pt-24 pb-12 px-4 shadow-sm">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                Help & Support
                            </h1>
                            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                                Track your reports or submit a new issue. We're
                                here to help.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto max-w-6xl px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Report List */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    className="pl-9 bg-white dark:bg-zinc-800"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-zinc-800">
                                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="RESOLVED">
                                        Resolved
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Content */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground">
                                    Loading your reports...
                                </p>
                            </div>
                        ) : filteredReports.length === 0 ? (
                            <div className="text-center py-20 px-4 border-2 border-dashed rounded-xl bg-white/50 dark:bg-zinc-800/50">
                                <div className="mx-auto bg-gray-100 dark:bg-zinc-700 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">
                                    No reports found
                                </h3>
                                <p className="text-muted-foreground max-w-sm mx-auto">
                                    {searchTerm || statusFilter !== "ALL"
                                        ? "Try adjusting your filters to find what you're looking for."
                                        : "You haven't submitted any reports yet. Use the form to create one."}
                                </p>
                                {(searchTerm || statusFilter !== "ALL") && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setStatusFilter("ALL");
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredReports.map((report) => (
                                    <Card
                                        key={report.id}
                                        className="group hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                                        onClick={() =>
                                            router.push(`/reports/${report.id}`)
                                        }
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={`gap-1.5 pl-1.5 pr-2.5 py-0.5 font-medium ${
                                                                report.status ===
                                                                "RESOLVED"
                                                                    ? "border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                                                    : "border-yellow-200 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                                                            }`}
                                                        >
                                                            {report.status ===
                                                            "RESOLVED" ? (
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <Clock className="h-3.5 w-3.5" />
                                                            )}
                                                            {report.status}
                                                        </Badge>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs font-normal"
                                                        >
                                                            {report.category}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                                        {report.subject}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                                        {report.description}
                                                    </p>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors mt-2" />
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-700 flex items-center justify-between text-xs text-muted-foreground">
                                                <span>
                                                    Created{" "}
                                                    {format(
                                                        new Date(
                                                            report.createdAt
                                                        ),
                                                        "PPP"
                                                    )}
                                                </span>
                                                {report.updatedAt !==
                                                    report.createdAt && (
                                                    <span>
                                                        Updated{" "}
                                                        {format(
                                                            new Date(
                                                                report.updatedAt
                                                            ),
                                                            "PPP"
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Create Form */}
                    <div>
                        <CreateReportForm onSuccess={fetchReports} />
                    </div>
                </div>
            </main>
        </div>
    );
}
