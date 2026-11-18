"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Report } from "@/services/reports.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { ReportActions } from "./ReportActions";
import {
    REPORT_CATEGORY_LABELS,
    REPORT_CATEGORY_STYLES,
    REPORT_STATUS_LABELS,
    REPORT_STATUS_STYLES,
} from "@/app/reports/constants";

export const columns: ColumnDef<Report>[] = [
    {
        accessorKey: "subject",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Subjek
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const report = row.original;
            const replyCount = report._count?.replies ?? 0;
            return (
                <Link
                    href={`/admin/reports/${report.id}`}
                    className="group flex flex-col max-w-[280px]"
                >
                    <span className="font-medium text-foreground group-hover:text-primary group-hover:underline truncate">
                        {report.subject}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">
                            #{report.id.slice(0, 8)}
                        </span>
                        {replyCount > 0 && (
                            <span className="inline-flex items-center gap-1">
                                • <MessageSquare className="h-3 w-3" />{" "}
                                {replyCount}
                            </span>
                        )}
                    </div>
                </Link>
            );
        },
    },
    {
        accessorKey: "category",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Kategori
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const category = row.getValue("category") as Report["category"];
            return (
                <Badge
                    variant="outline"
                    className={REPORT_CATEGORY_STYLES[category]}
                >
                    {REPORT_CATEGORY_LABELS[category] ?? category}
                </Badge>
            );
        },
    },
    {
        id: "user",
        accessorKey: "user.fullName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Pengguna
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{user?.fullName || "-"}</span>
                    <span className="text-xs text-muted-foreground">
                        {user?.email || "-"}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.getValue("status") as Report["status"];
            return (
                <Badge
                    variant="outline"
                    className={`gap-1.5 ${REPORT_STATUS_STYLES[status]}`}
                >
                    {status === "RESOLVED" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : status === "IN_PROGRESS" ? (
                        <MessageSquare className="h-3.5 w-3.5" />
                    ) : (
                        <Clock className="h-3.5 w-3.5" />
                    )}
                    {REPORT_STATUS_LABELS[status] ?? status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Tanggal
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) =>
            format(new Date(row.getValue("createdAt")), "dd MMM yyyy", {
                locale: idLocale,
            }),
    },
    {
        id: "actions",
        cell: ({ row }) => <ReportActions report={row.original} />,
    },
];
