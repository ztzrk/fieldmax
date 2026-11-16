"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    useGetReportById,
    useReplyReport,
    useResolveReport,
} from "@/hooks/useReports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Loader2,
    Mail,
    MessageSquare,
    Send,
    ShieldCheck,
    User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import {
    REPORT_CATEGORY_LABELS,
    REPORT_CATEGORY_STYLES,
    REPORT_STATUS_LABELS,
    REPORT_STATUS_STYLES,
} from "@/app/reports/constants";

function getInitials(name?: string) {
    if (!name) return "U";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export default function AdminReportDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [replyMessage, setReplyMessage] = useState("");

    const { data: report, isLoading } = useGetReportById(id);
    const { mutateAsync: replyReport, isPending: isReplying } =
        useReplyReport(id);
    const { mutateAsync: resolveReport, isPending: isResolving } =
        useResolveReport(id);

    const handleReply = async () => {
        if (!replyMessage.trim() || isReplying) return;
        try {
            await replyReport({ message: replyMessage });
            setReplyMessage("");
            toast.success("Balasan berhasil dikirim");
        } catch {
            toast.error("Gagal mengirim balasan");
        }
    };

    const handleResolve = async () => {
        try {
            await resolveReport(id);
            toast.success("Laporan berhasil ditandai selesai");
        } catch {
            toast.error("Gagal menyelesaikan laporan");
        }
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!report) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">
                        Laporan tidak ditemukan
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Tiket laporan yang Anda cari tidak tersedia.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push("/admin/reports")}
                >
                    Kembali ke Daftar Laporan
                </Button>
            </div>
        );
    }

    const replies = report.replies ?? [];

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                    onClick={() => router.push("/admin/reports")}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Daftar Laporan
                </Button>

                {report.status === "PENDING" && (
                    <Button
                        onClick={handleResolve}
                        disabled={isResolving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isResolving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        {isResolving ? "Memproses..." : "Tandai Selesai"}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Column: Report + Thread + Reply */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Report Header */}
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="space-y-3 pb-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={`gap-1.5 ${REPORT_STATUS_STYLES[report.status]}`}
                                    >
                                        {report.status === "RESOLVED" ? (
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        ) : (
                                            <Clock className="h-3.5 w-3.5" />
                                        )}
                                        {REPORT_STATUS_LABELS[report.status]}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={
                                            REPORT_CATEGORY_STYLES[
                                                report.category
                                            ]
                                        }
                                    >
                                        {REPORT_CATEGORY_LABELS[report.category]}
                                    </Badge>
                                </div>
                                <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                                    #{report.id.slice(0, 8)}
                                </span>
                            </div>
                            <div>
                                <CardTitle className="text-xl sm:text-2xl font-bold leading-snug">
                                    {report.subject}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Dibuat pada{" "}
                                    {format(
                                        new Date(report.createdAt),
                                        "dd MMMM yyyy, HH:mm",
                                        { locale: idLocale }
                                    )}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 bg-muted/40 border border-border/60 rounded-lg">
                                <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                                    {report.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conversation Thread */}
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/60">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    Percakapan
                                </CardTitle>
                                <Badge variant="secondary" className="text-xs">
                                    {replies.length} balasan
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {replies.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">
                                    Belum ada balasan pada laporan ini.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {replies.map((reply) => {
                                        const isMe =
                                            reply.senderId === user?.id;
                                        const isAdminOrStaff =
                                            reply.sender?.role &&
                                            reply.sender.role !== "USER";

                                        return (
                                            <div
                                                key={reply.id}
                                                className={`flex gap-3 ${
                                                    isMe
                                                        ? "flex-row-reverse"
                                                        : "flex-row"
                                                }`}
                                            >
                                                <div
                                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 ${
                                                        isMe
                                                            ? "bg-primary text-primary-foreground"
                                                            : isAdminOrStaff
                                                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                                              : "bg-muted text-muted-foreground"
                                                    }`}
                                                >
                                                    {getInitials(
                                                        reply.sender?.fullName
                                                    )}
                                                </div>
                                                <div
                                                    className={`flex flex-col max-w-[82%] ${
                                                        isMe
                                                            ? "items-end"
                                                            : "items-start"
                                                    }`}
                                                >
                                                    <div
                                                        className={`rounded-2xl px-4 py-3 ${
                                                            isMe
                                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                                : "bg-muted/70 border border-border/60 text-foreground rounded-tl-sm"
                                                        }`}
                                                    >
                                                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                                            {reply.message}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 px-1">
                                                        <span className="text-xs text-muted-foreground font-medium">
                                                            {reply.sender
                                                                ?.fullName ||
                                                                "Pengguna"}
                                                        </span>
                                                        {isAdminOrStaff && (
                                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-medium">
                                                                <ShieldCheck className="h-3 w-3" />
                                                                Admin
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-muted-foreground">
                                                            •{" "}
                                                            {format(
                                                                new Date(
                                                                    reply.createdAt
                                                                ),
                                                                "dd MMM yyyy, HH:mm",
                                                                {
                                                                    locale: idLocale,
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reply Input */}
                    <Card className="border-border/70 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-3">
                                <Textarea
                                    placeholder="Ketik balasan untuk pelapor di sini..."
                                    value={replyMessage}
                                    onChange={(e) =>
                                        setReplyMessage(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            (e.ctrlKey || e.metaKey) &&
                                            e.key === "Enter"
                                        ) {
                                            e.preventDefault();
                                            handleReply();
                                        }
                                    }}
                                    rows={4}
                                    className="resize-none"
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <span className="text-xs text-muted-foreground">
                                        Tekan Ctrl + Enter untuk mengirim cepat
                                    </span>
                                    <Button
                                        onClick={handleReply}
                                        disabled={
                                            isReplying || !replyMessage.trim()
                                        }
                                    >
                                        {isReplying ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="mr-2 h-4 w-4" />
                                        )}
                                        {isReplying
                                            ? "Mengirim..."
                                            : "Kirim Balasan"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar: Reporter & Ticket Metadata */}
                <div className="space-y-6">
                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Informasi Pelapor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                                    {getInitials(report.user?.fullName)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">
                                        {report.user?.fullName || "-"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {report.user?.email || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-border/60 space-y-2.5 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <UserIcon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        {report.user?.fullName || "-"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                        {report.user?.email || "-"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Detail Tiket
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">
                                    ID Tiket
                                </span>
                                <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                                    #{report.id.slice(0, 8)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Kategori
                                </span>
                                <span className="font-medium">
                                    {REPORT_CATEGORY_LABELS[report.category]}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Status
                                </span>
                                <span className="font-medium">
                                    {REPORT_STATUS_LABELS[report.status]}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Dibuat
                                </span>
                                <span className="text-right">
                                    {format(
                                        new Date(report.createdAt),
                                        "dd MMM yyyy, HH:mm",
                                        { locale: idLocale }
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">
                                    Diperbarui
                                </span>
                                <span className="text-right">
                                    {format(
                                        new Date(report.updatedAt),
                                        "dd MMM yyyy, HH:mm",
                                        { locale: idLocale }
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
