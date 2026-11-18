"use client";

import { useState } from "react";
import { Report } from "@/services/reports.service";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, CheckCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useResolveReport, useReopenReport } from "@/hooks/useReports";
import { toast } from "sonner";

interface ReportActionsProps {
    report: Report;
}

export function ReportActions({ report }: ReportActionsProps) {
    const [confirmAction, setConfirmAction] = useState<
        "resolve" | "reopen" | null
    >(null);
    const { mutate: resolveReport, isPending: isResolving } =
        useResolveReport();
    const { mutate: reopenReport, isPending: isReopening } = useReopenReport();
    const isPending = isResolving || isReopening;

    const handleConfirm = () => {
        if (confirmAction === "resolve") {
            resolveReport(report.id, {
                onSuccess: () => {
                    toast.success("Laporan berhasil diselesaikan");
                    setConfirmAction(null);
                },
                onError: (error) => {
                    toast.error("Gagal menyelesaikan laporan");
                    console.error(error);
                },
            });
        } else if (confirmAction === "reopen") {
            reopenReport(report.id, {
                onSuccess: () => {
                    toast.success("Laporan berhasil dibuka kembali");
                    setConfirmAction(null);
                },
                onError: (error) => {
                    toast.error("Gagal membuka kembali laporan");
                    console.error(error);
                },
            });
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/reports/${report.id}`}>
                            Lihat Detail
                        </Link>
                    </DropdownMenuItem>
                    {report.status !== "RESOLVED" ? (
                        <DropdownMenuItem
                            onClick={() => setConfirmAction("resolve")}
                            disabled={isPending}
                            className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/30"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Tandai Selesai
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => setConfirmAction("reopen")}
                            disabled={isPending}
                            className="text-blue-600 focus:text-blue-700 focus:bg-blue-50 dark:focus:bg-blue-950/30"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Buka Kembali
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog
                open={confirmAction !== null}
                onOpenChange={(open) => {
                    if (!open && !isPending) setConfirmAction(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction === "resolve"
                                ? "Tandai Laporan Selesai?"
                                : "Buka Kembali Laporan?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction === "resolve"
                                ? "Pelapor tidak akan dapat mengirim balasan baru setelah laporan ditandai selesai."
                                : "Laporan akan dibuka kembali dengan status Sedang Ditangani agar percakapan dapat dilanjutkan."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={isPending}
                        >
                            {isPending ? "Memproses..." : "Ya, Lanjutkan"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
