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
    const statusVariantMap = {
        PENDING: "secondary",
        APPROVED: "default",
        REJECTED: "destructive",
    } as const;

    return <Badge variant={statusVariantMap[status]}>{status}</Badge>;
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
        <Card>
            <CardHeader>
                <CardTitle>Status Lapangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <p>Status Saat Ini:</p>
                    <StatusBadge status={field.status} />
                </div>
                {field.status === "REJECTED" && field.rejectionReason && (
                    <div className="text-red-500">
                        <p className="font-semibold">Alasan Penolakan:</p>
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
