"use client";

import { useRenterRevenue } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Building2, Trophy, Wallet } from "lucide-react";

export default function RevenuePage() {
    const { data: stats, isLoading, error } = useRenterRevenue();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-destructive font-medium">
                Gagal memuat data pendapatan.
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Pendapatan
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Ringkasan pendapatan dari tempat olahraga dan lapangan
                        Anda
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="rounded-xl border-border/60 shadow-sm hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Pendapatan
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total akumulasi pendapatan
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border/60 shadow-sm hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tempat Olahraga Terbaik
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                            <Building2 className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold truncate">
                            {stats.revenueByVenue[0]?.venueName || "-"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.revenueByVenue[0]
                                ? formatCurrency(
                                      stats.revenueByVenue[0].totalRevenue
                                  )
                                : formatCurrency(0)}
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-border/60 shadow-sm hover:border-primary/40 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Lapangan Terbaik
                        </CardTitle>
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Trophy className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold truncate">
                            {stats.revenueByField[0]?.fieldName || "-"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.revenueByField[0]
                                ? formatCurrency(
                                      stats.revenueByField[0].totalRevenue
                                  )
                                : formatCurrency(0)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="venue" className="space-y-4">
                <TabsList className="bg-card border border-border/70 p-1">
                    <TabsTrigger value="venue">
                        Pendapatan per Tempat Olahraga
                    </TabsTrigger>
                    <TabsTrigger value="field">
                        Pendapatan per Lapangan
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="venue" className="space-y-4">
                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Pendapatan per Tempat Olahraga</CardTitle>
                            <CardDescription>
                                Ringkasan performa pendapatan tempat olahraga
                                Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.revenueByVenue}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            className="stroke-border/60"
                                        />
                                        <XAxis
                                            dataKey="venueName"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                formatCurrency(value)
                                            }
                                        />
                                        <Tooltip
                                            cursor={{ fill: "rgba(0,0,0,0.04)" }}
                                            contentStyle={{
                                                borderRadius: "10px",
                                                border: "1px solid var(--border)",
                                                backgroundColor: "var(--card)",
                                            }}
                                            formatter={(value) =>
                                                formatCurrency(
                                                    Number(value ?? 0)
                                                )
                                            }
                                        />
                                        <Bar
                                            dataKey="totalRevenue"
                                            fill="currentColor"
                                            radius={[6, 6, 0, 0]}
                                            className="fill-primary"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Rincian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            Nama Tempat Olahraga
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total Pendapatan
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.revenueByVenue.map((venue) => (
                                        <TableRow key={venue.venueId}>
                                            <TableCell className="font-medium">
                                                {venue.venueName}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency(
                                                    venue.totalRevenue
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stats.revenueByVenue.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={2}
                                                className="text-center h-24 text-muted-foreground"
                                            >
                                                Belum ada data pendapatan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="field" className="space-y-4">
                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Pendapatan per Lapangan</CardTitle>
                            <CardDescription>
                                Ringkasan performa pendapatan lapangan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.revenueByField}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            className="stroke-border/60"
                                        />
                                        <XAxis
                                            dataKey="fieldName"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                formatCurrency(value)
                                            }
                                        />
                                        <Tooltip
                                            cursor={{ fill: "rgba(0,0,0,0.04)" }}
                                            contentStyle={{
                                                borderRadius: "10px",
                                                border: "1px solid var(--border)",
                                                backgroundColor: "var(--card)",
                                            }}
                                            formatter={(value) =>
                                                formatCurrency(
                                                    Number(value ?? 0)
                                                )
                                            }
                                            labelFormatter={(
                                                label,
                                                payload
                                            ) => {
                                                if (payload && payload[0]) {
                                                    return `${label} (${payload[0].payload.venueName})`;
                                                }
                                                return label;
                                            }}
                                        />
                                        <Bar
                                            dataKey="totalRevenue"
                                            fill="currentColor"
                                            radius={[6, 6, 0, 0]}
                                            className="fill-primary"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader>
                            <CardTitle>Rincian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Lapangan</TableHead>
                                        <TableHead>
                                            Nama Tempat Olahraga
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total Pendapatan
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.revenueByField.map((field) => (
                                        <TableRow key={field.fieldId}>
                                            <TableCell className="font-medium">
                                                {field.fieldName}
                                            </TableCell>
                                            <TableCell>
                                                {field.venueName}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency(
                                                    field.totalRevenue
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stats.revenueByField.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-center h-24 text-muted-foreground"
                                            >
                                                Belum ada data pendapatan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
