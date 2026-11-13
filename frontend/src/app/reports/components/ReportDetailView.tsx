"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetReportById, useReplyReport } from "@/hooks/useReports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export interface ReportDetailViewProps {
    backUrl?: string; // Optional: specific URL to go back to instead of router.back()
    backLabel?: string;
}

export function ReportDetailView({
    backUrl,
    backLabel = "Kembali ke Laporan",
}: ReportDetailViewProps) {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [replyMessage, setReplyMessage] = useState("");

    const { data: report, isLoading } = useGetReportById(id);
    const { mutateAsync: replyReport, isPending: isReplying } = useReplyReport(id);

    const handleReply = async () => {
        if (!replyMessage.trim()) return;
        try {
            await replyReport({ message: replyMessage });
            setReplyMessage("");
            toast.success("Balasan berhasil dikirim");
        } catch (error) {
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <p>Laporan tidak ditemukan</p>
                <Button onClick={handleBack}>Kembali</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-6 gap-2" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" /> {backLabel}
            </Button>

            {/* Report Header */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">
                        {report.subject}
                    </CardTitle>
                    <div className="flex gap-2">
                        <Badge variant="outline">{report.category}</Badge>
                        <Badge
                            variant={
                                report.status === "RESOLVED"
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            {report.status === "RESOLVED" ? "Selesai" : "Menunggu"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                        Dibuat pada {format(new Date(report.createdAt), "PPP p")}
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="whitespace-pre-wrap">
                            {report.description}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Conversation Thread */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Percakapan</h3>
                <div className="space-y-4">
                    {report.replies?.map((reply) => {
                        const isMe = reply.senderId === user?.id;
                        return (
                            <div
                                key={reply.id}
                                className={`flex flex-col ${
                                    isMe ? "items-end" : "items-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-4 ${
                                        isMe
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm">
                                        {reply.message}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-1 px-1">
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {reply.sender?.fullName || "User"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        •{" "}
                                        {format(
                                            new Date(reply.createdAt),
                                            "PP p"
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {(!report.replies || report.replies.length === 0) && (
                        <p className="text-muted-foreground text-sm italic">
                            Belum ada balasan.
                        </p>
                    )}
                </div>
            </div>

            {/* Reply Input */}
            <Card>
                <CardContent className="pt-6">
                    {report.status === "RESOLVED" && user?.role !== "ADMIN" ? (
                        <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-gray-200 dark:border-zinc-700">
                            <p className="font-medium">
                                Laporan ini telah ditandai selesai.
                            </p>
                            <p className="text-sm mt-1">
                                Anda tidak dapat lagi mengirim balasan pada percakapan ini.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Textarea
                                placeholder="Ketik balasan Anda di sini..."
                                value={replyMessage}
                                onChange={(e) =>
                                    setReplyMessage(e.target.value)
                                }
                                rows={4}
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleReply}
                                    disabled={
                                        isReplying || !replyMessage.trim()
                                    }
                                >
                                    {isReplying ? (
                                        <FullScreenLoader />
                                    ) : (
                                        <Send className="mr-2 h-4 w-4" />
                                    )}
                                    Kirim Balasan
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
