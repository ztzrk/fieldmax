"use client";

import { useMemo, useState } from "react";
import { useGetMyReports } from "@/hooks/useReports";
import { CreateReportForm } from "@/app/reports/components/create-report-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    ChevronRight,
    Search,
    Filter,
    Inbox,
    Tag,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    REPORT_CATEGORY_LABELS,
    REPORT_CATEGORY_STYLES,
    REPORT_STATUS_LABELS,
    REPORT_STATUS_STYLES,
} from "../constants";

export interface ReportsViewProps {
    title?: string;
    subtitle?: string;
    basePath?: string; // e.g. "/reports" or "/renter/reports"
}

export function ReportsView({
    title = "Bantuan & Dukungan",
    subtitle = "Pantau status laporan Anda atau ajukan kendala baru. Tim kami siap membantu.",
    basePath = "/reports",
}: ReportsViewProps) {
    const { data: reports = [], isLoading, refetch } = useGetMyReports();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const router = useRouter();

    const stats = useMemo(() => {
        const total = reports.length;
        const pending = reports.filter((r) => r.status === "PENDING").length;
        const inProgress = reports.filter(
            (r) => r.status === "IN_PROGRESS"
        ).length;
        const resolved = reports.filter((r) => r.status === "RESOLVED").length;
        return { total, pending, inProgress, resolved };
    }, [reports]);

    const filteredReports = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return reports.filter((report) => {
            const matchesSearch =
                !q ||
                report.subject.toLowerCase().includes(q) ||
                report.description.toLowerCase().includes(q);
            const matchesStatus =
                statusFilter === "ALL" || report.status === statusFilter;
            const matchesCategory =
                categoryFilter === "ALL" || report.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [reports, searchTerm, statusFilter, categoryFilter]);

    const hasActiveFilters =
        Boolean(searchTerm.trim()) ||
        statusFilter !== "ALL" ||
        categoryFilter !== "ALL";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Summary Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className={`text-left rounded-xl border p-4 transition-all ${
                        statusFilter === "ALL"
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border/70 bg-card hover:border-border"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Total Laporan
                        </span>
                        <Inbox className="h-4 w-4 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                        {stats.total}
                    </p>
                </button>
                <button
                    type="button"
                    onClick={() => setStatusFilter("PENDING")}
                    className={`text-left rounded-xl border p-4 transition-all ${
                        statusFilter === "PENDING"
                            ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 ring-1 ring-amber-500/20"
                            : "border-border/70 bg-card hover:border-border"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Menunggu Tanggapan
                        </span>
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                        {stats.pending}
                    </p>
                </button>
                <button
                    type="button"
                    onClick={() => setStatusFilter("IN_PROGRESS")}
                    className={`text-left rounded-xl border p-4 transition-all ${
                        statusFilter === "IN_PROGRESS"
                            ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 ring-1 ring-blue-500/20"
                            : "border-border/70 bg-card hover:border-border"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Sedang Ditangani
                        </span>
                        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                        {stats.inProgress}
                    </p>
                </button>
                <button
                    type="button"
                    onClick={() => setStatusFilter("RESOLVED")}
                    className={`text-left rounded-xl border p-4 transition-all ${
                        statusFilter === "RESOLVED"
                            ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-1 ring-emerald-500/20"
                            : "border-border/70 bg-card hover:border-border"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                            Selesai
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                        {stats.resolved}
                    </p>
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Report List */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari subjek atau isi laporan..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[190px] bg-card">
                                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">
                                    Semua Kategori
                                </SelectItem>
                                {(
                                    Object.keys(
                                        REPORT_CATEGORY_LABELS
                                    ) as Array<
                                        keyof typeof REPORT_CATEGORY_LABELS
                                    >
                                ).map((key) => (
                                    <SelectItem key={key} value={key}>
                                        {REPORT_CATEGORY_LABELS[key]}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[165px] bg-card">
                                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filter status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Semua Status</SelectItem>
                                <SelectItem value="PENDING">Menunggu</SelectItem>
                                <SelectItem value="IN_PROGRESS">
                                    Sedang Ditangani
                                </SelectItem>
                                <SelectItem value="RESOLVED">Selesai</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="grid gap-4">
                            {[1, 2, 3].map((i) => (
                                <Card
                                    key={i}
                                    className="border-border/60 animate-pulse"
                                >
                                    <CardContent className="p-6 space-y-3">
                                        <div className="flex gap-2">
                                            <div className="h-5 w-20 rounded-full bg-muted" />
                                            <div className="h-5 w-28 rounded-full bg-muted" />
                                        </div>
                                        <div className="h-5 w-2/3 rounded bg-muted" />
                                        <div className="h-4 w-full rounded bg-muted" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="text-center py-16 px-4 border-2 border-dashed border-border rounded-xl bg-card/60">
                            <div className="mx-auto bg-muted h-14 w-14 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1.5">
                                Tidak ada laporan ditemukan
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                {hasActiveFilters
                                    ? "Coba sesuaikan kata kunci atau filter pencarian Anda."
                                    : "Anda belum membuat laporan apa pun. Gunakan formulir di samping untuk membuat laporan baru."}
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter("ALL");
                                        setCategoryFilter("ALL");
                                    }}
                                >
                                    Reset Filter
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredReports.map((report) => (
                                <Card
                                    key={report.id}
                                    className="group hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer border-border/70"
                                    onClick={() =>
                                        router.push(`${basePath}/${report.id}`)
                                    }
                                >
                                    <CardContent className="p-5 sm:p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1.5 flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`gap-1.5 pl-2 pr-2.5 py-0.5 font-medium ${REPORT_STATUS_STYLES[report.status]}`}
                                                    >
                                                        {report.status ===
                                                        "RESOLVED" ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        ) : report.status ===
                                                          "IN_PROGRESS" ? (
                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Clock className="h-3.5 w-3.5" />
                                                        )}
                                                        {
                                                            REPORT_STATUS_LABELS[
                                                                report.status
                                                            ]
                                                        }
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs font-medium ${REPORT_CATEGORY_STYLES[report.category]}`}
                                                    >
                                                        {
                                                            REPORT_CATEGORY_LABELS[
                                                                report.category
                                                            ]
                                                        }
                                                    </Badge>
                                                    <span className="text-xs font-mono text-muted-foreground">
                                                        #{report.id.slice(0, 8)}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                                    {report.subject}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {report.description}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                                        </div>
                                        <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span>
                                                    Dibuat{" "}
                                                    {format(
                                                        new Date(
                                                            report.createdAt
                                                        ),
                                                        "dd MMM yyyy, HH:mm",
                                                        { locale: idLocale }
                                                    )}
                                                </span>
                                                {(report.replies?.length ?? 0) >
                                                    0 && (
                                                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                                                        <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                                        {report.replies!.length}{" "}
                                                        balasan
                                                    </span>
                                                )}
                                            </div>
                                            {report.updatedAt !==
                                                report.createdAt && (
                                                <span>
                                                    Diperbarui{" "}
                                                    {format(
                                                        new Date(
                                                            report.updatedAt
                                                        ),
                                                        "dd MMM yyyy, HH:mm",
                                                        { locale: idLocale }
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
                    <CreateReportForm onSuccess={refetch} />
                </div>
            </div>
        </div>
    );
}
