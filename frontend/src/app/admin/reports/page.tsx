"use client";

import { useEffect, useState } from "react";
import { Report, reportsService } from "@/services/reports.service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const data = await reportsService.getAllReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Reports</h1>

            {isLoading ? (
                <FullScreenLoader />
            ) : (
                <div className="border rounded-lg overflow-hidden bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-10 text-muted-foreground"
                                    >
                                        No reports found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium">
                                            {report.subject}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {report.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {report.user?.fullName} <br />
                                            <span className="text-xs text-muted-foreground">
                                                {report.user?.email}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    report.status === "RESOLVED"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {format(
                                                new Date(report.createdAt),
                                                "dd MMM yyyy"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/reports/${report.id}`
                                                    )
                                                }
                                            >
                                                View & Reply
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
