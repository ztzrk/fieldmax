"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetReportById, useReplyReport } from "@/hooks/useReports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Loader2,
    MessageSquare,
    Send,
    ShieldCheck,
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
} from "../constants";

export interface ReportDetailViewProps {
    backUrl?: string;
    backLabel?: string;
}

function getInitials(name?: string) {
    if (!name) return "U";
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

export function ReportDetailView({
    backUrl,
    backLabel = "Kembali ke Daftar Laporan",
}: ReportDetailViewProps) {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [replyMessage, setReplyMessage] = useState("");

    const { data: report, isLoading } = useGetReportById(id);
    const { mutateAsync: replyReport, isPending: isReplying } =
        useReplyReport(id);

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

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl);
        } else {
            router.back();
        }
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!report) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">
                        Laporan tidak ditemukan
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Laporan yang Anda cari tidak tersedia atau telah dihapus.
                    </p>
                </div>
                <Button onClick={handleBack} variant="outline">
                    Kembali
                </Button>
            </div>
        );
    }

    const replies = report.replies ?? [];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Button
                variant="ghost"
                className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={handleBack}
            >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
            </Button>

            {/* Report Header */}
            <Card className="border-border/70 shadow-sm">
                <CardHeader className="space-y-3 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className={`gap-1.5 pl-2 pr-2.5 py-0.5 font-medium ${REPORT_STATUS_STYLES[report.status]}`}
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
                                className={`font-medium ${REPORT_CATEGORY_STYLES[report.category]}`}
                            >
                                {REPORT_CATEGORY_LABELS[report.category]}
                            </Badge>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                            Tiket #{report.id.slice(0, 8)}
                        </span>
                    </div>
                    <div>
                        <CardTitle className="text-xl sm:text-2xl font-bold leading-snug">
                            {report.subject}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
                            Dibuat pada{" "}
                            {format(
                                new Date(report.createdAt),
                                "dd MMMM yyyy, HH:mm",
                                { locale: idLocale }
                            )}
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-muted/40 border border-border/60 rounded-lg">
                        <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-foreground">
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
                <CardContent className="pt-6 space-y-5">
                    {replies.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">
                                Belum ada balasan. Tim dukungan kami akan segera
                                menanggapi laporan Anda.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {replies.map((reply) => {
                                const isMe = reply.senderId === user?.id;
                                const isStaff =
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
                                                    : isStaff
                                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                                      : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {getInitials(reply.sender?.fullName)}
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
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {isMe
                                                        ? "Anda"
                                                        : reply.sender
                                                              ?.fullName ||
                                                          "Pengguna"}
                                                </span>
                                                {isStaff && !isMe && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-medium">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Tim Dukungan
                                                    </span>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    •{" "}
                                                    {format(
                                                        new Date(
                                                            reply.createdAt
                                                        ),
                                                        "dd MMM yyyy, HH:mm",
                                                        { locale: idLocale }
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
                    {report.status === "RESOLVED" && user?.role !== "ADMIN" ? (
                        <div className="text-center py-6 px-4 text-muted-foreground bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-dashed border-emerald-200 dark:border-emerald-900/50">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                            <p className="font-medium text-foreground">
                                Laporan ini telah ditandai selesai
                            </p>
                            <p className="text-sm mt-1">
                                Percakapan telah ditutup. Jika masih ada kendala
                                baru, silakan buat laporan baru.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Textarea
                                placeholder="Ketik balasan Anda di sini..."
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
