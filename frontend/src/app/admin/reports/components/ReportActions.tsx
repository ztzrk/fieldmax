"use client";

import { Report } from "@/services/reports.service";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useResolveReport } from "@/hooks/useReports";
import { toast } from "sonner";

interface ReportActionsProps {
    report: Report;
}

export function ReportActions({ report }: ReportActionsProps) {
    const { mutate: resolveReport, isPending } = useResolveReport();

    const handleResolve = () => {
        resolveReport(report.id, {
            onSuccess: () => {
                toast.success("Laporan berhasil diselesaikan");
            },
            onError: (error) => {
                toast.error("Gagal menyelesaikan laporan");
                console.error(error);
            },
        });
    };

    return (
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
                {report.status === "PENDING" && (
                    <DropdownMenuItem
                        onClick={handleResolve}
                        disabled={isPending}
                        className="text-green-600 focus:text-green-700 focus:bg-green-50"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Tandai Selesai
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
