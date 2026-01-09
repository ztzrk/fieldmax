"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Report, reportsService } from "@/services/reports.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export default function ReportDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    const fetchReport = async () => {
        try {
            setIsLoading(true);
            const data = await reportsService.getReportById(id);
            setReport(data);
        } catch (error) {
            console.error("Failed to fetch report", error);
            toast.error("Failed to load report details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchReport();
        }
    }, [id]);

    const handleReply = async () => {
        if (!replyMessage.trim()) return;
        try {
            setIsReplying(true);
            await reportsService.replyToReport(id, { message: replyMessage });
            setReplyMessage("");
            fetchReport();
            toast.success("Reply sent");
        } catch (error) {
            toast.error("Failed to send reply");
        } finally {
            setIsReplying(false);
        }
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!report) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <p>Report not found</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Reports
                </Button>

                <div className="space-y-6">
                    {/* Report Header */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">
                                {report.subject}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Badge variant="outline">
                                    {report.category}
                                </Badge>
                                <Badge
                                    variant={
                                        report.status === "RESOLVED"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {report.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">
                                Created on{" "}
                                {format(new Date(report.createdAt), "PPP p")}
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
                        <h3 className="text-lg font-semibold">Conversation</h3>
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
                                                {reply.sender?.fullName ||
                                                    "User"}
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
                            {report.replies?.length === 0 && (
                                <p className="text-muted-foreground text-sm italic">
                                    No replies yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Reply Input */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4">
                                <Textarea
                                    placeholder="Type your reply here..."
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
                                        Send Reply
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
