"use client";

import { useState } from "react";
import {
    useApproveField,
    useRejectField,
    useResubmitField,
} from "@/hooks/useFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { FieldDetailResponseSchema } from "@/lib/schema/field.schema";

interface FieldStatusUpdaterProps {
    field: FieldDetailResponseSchema;
    role: "ADMIN" | "RENTER";
}

function StatusBadge({
    status,
}: {
    status: "PENDING" | "APPROVED" | "REJECTED";
}) {
    const statusMap = {
        PENDING: {
            label: "Menunggu Verifikasi",
            className:
                "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
        },
        APPROVED: {
            label: "Disetujui",
            className:
                "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
        },
        REJECTED: {
            label: "Ditolak",
            className:
                "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
        },
    } as const;

    const current = statusMap[status];

    return (
        <Badge variant="outline" className={current.className}>
            {current.label}
        </Badge>
    );
}

/**
 * Component for updating the status of a field (Approve, Reject, Resubmit).
 * Displays current status and rejection reason if applicable.
 */
export function FieldStatusUpdater({ field, role }: FieldStatusUpdaterProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const { mutate: approveField, isPending: isApproving } = useApproveField(
        field.id
    );
    const { mutate: rejectField, isPending: isRejecting } = useRejectField(
        field.id
    );
    const { mutate: resubmitField, isPending: isResubmitting } =
        useResubmitField(field.id);

    const handleReject = () => {
        if (rejectionReason.trim()) {
            rejectField(rejectionReason);
        }
    };

    return (
        <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Status Persetujuan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">
                        Status Saat Ini
                    </span>
                    <StatusBadge status={field.status} />
                </div>
                {field.status === "REJECTED" && field.rejectionReason && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                        <p className="font-semibold mb-1">Alasan Penolakan:</p>
                        <p>{field.rejectionReason}</p>
                    </div>
                )}

                <div className="flex space-x-2">
                    {role === "ADMIN" && field.status === "PENDING" && (
                        <>
                            <Button
                                onClick={() => approveField()}
                                disabled={isApproving}
                                variant="outline"
                            >
                                {isApproving ? "Menyetujui..." : "Setujui"}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        disabled={isRejecting}
                                    >
                                        Tolak
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Yakin ingin menolak lapangan ini?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Harap berikan alasan penolakan.
                                            Alasan ini akan ditampilkan kepada
                                            mitra.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <Textarea
                                        placeholder="Tulis alasan penolakan di sini."
                                        value={rejectionReason}
                                        onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                        }
                                    />
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleReject}
                                            disabled={
                                                isRejecting ||
                                                !rejectionReason.trim()
                                            }
                                        >
                                            {isRejecting
                                                ? "Menolak..."
                                                : "Konfirmasi Penolakan"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                    {field.status === "REJECTED" && (
                        <Button
                            onClick={() => resubmitField()}
                            disabled={isResubmitting}
                        >
                            {isResubmitting
                                ? "Mengajukan Ulang..."
                                : role === "ADMIN"
                                ? "Tandai Menunggu"
                                : "Ajukan Ulang untuk Ditinjau"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
