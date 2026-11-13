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
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export default function RevenuePage() {
    const { data: stats, isLoading, error } = useRenterRevenue();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-red-500">
                Gagal memuat data pendapatan.
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Pendapatan
                    </h2>
                    <p className="text-muted-foreground">
                        Ringkasan pendapatan dari venue dan lapangan Anda
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Pendapatan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total akumulasi pendapatan
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Venue Berperforma Terbaik
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.revenueByVenue[0]?.venueName || "-"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.revenueByVenue[0]
                                ? formatCurrency(
                                      stats.revenueByVenue[0].totalRevenue,
                                  )
                                : formatCurrency(0)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Lapangan Berperforma Terbaik
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.revenueByField[0]?.fieldName || "-"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.revenueByField[0]
                                ? formatCurrency(
                                      stats.revenueByField[0].totalRevenue,
                                  )
                                : formatCurrency(0)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="venue" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="venue">Pendapatan per Venue</TabsTrigger>
                    <TabsTrigger value="field">Pendapatan per Lapangan</TabsTrigger>
                </TabsList>

                <TabsContent value="venue" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pendapatan per Venue</CardTitle>
                            <CardDescription>
                                Ringkasan performa pendapatan venue Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.revenueByVenue}>
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
                                            formatter={(value) =>
                                                formatCurrency(
                                                    Number(value ?? 0),
                                                )
                                            }
                                        />
                                        <Bar
                                            dataKey="totalRevenue"
                                            fill="currentColor"
                                            radius={[4, 4, 0, 0]}
                                            className="fill-primary"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rincian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Venue</TableHead>
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
                                            <TableCell className="text-right">
                                                {formatCurrency(
                                                    venue.totalRevenue,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stats.revenueByVenue.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={2}
                                                className="text-center h-24"
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
                    <Card>
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
                                            formatter={(value) =>
                                                formatCurrency(
                                                    Number(value ?? 0),
                                                )
                                            }
                                            labelFormatter={(
                                                label,
                                                payload,
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
                                            radius={[4, 4, 0, 0]}
                                            className="fill-primary"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rincian</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Lapangan</TableHead>
                                        <TableHead>Nama Venue</TableHead>
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
                                            <TableCell className="text-right">
                                                {formatCurrency(
                                                    field.totalRevenue,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stats.revenueByField.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-center h-24"
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
