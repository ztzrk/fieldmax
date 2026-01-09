"use client";

import { useQuery } from "@tanstack/react-query";
import RenterService from "@/services/renter.service";
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
    const {
        data: stats,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["renter-revenue"],
        queryFn: RenterService.getRevenueStats,
    });

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-red-500">
                Failed to load revenue data.
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Revenue
                    </h2>
                    <p className="text-muted-foreground">
                        Overview of your earning from venues and fields
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime earnings
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Top Performing Venue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.revenueByVenue[0]?.venueName || "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.revenueByVenue[0]
                                ? formatCurrency(
                                      stats.revenueByVenue[0].totalRevenue
                                  )
                                : "$0"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Top Performing Field
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.revenueByField[0]?.fieldName || "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.revenueByField[0]
                                ? formatCurrency(
                                      stats.revenueByField[0].totalRevenue
                                  )
                                : "$0"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="venue" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="venue">Revenue by Venue</TabsTrigger>
                    <TabsTrigger value="field">Revenue by Field</TabsTrigger>
                </TabsList>

                <TabsContent value="venue" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Venue</CardTitle>
                            <CardDescription>
                                Performance overview of your venues
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
                                                `$${value}`
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value: number) =>
                                                formatCurrency(value)
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
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Venue Name</TableHead>
                                        <TableHead className="text-right">
                                            Total Revenue
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
                                                    venue.totalRevenue
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
                                                No revenue data available
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
                            <CardTitle>Revenue by Field</CardTitle>
                            <CardDescription>
                                Performance overview of your fields
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
                                                `$${value}`
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value: number) =>
                                                formatCurrency(value)
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
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Field Name</TableHead>
                                        <TableHead>Venue Name</TableHead>
                                        <TableHead className="text-right">
                                            Total Revenue
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
                                                    field.totalRevenue
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
                                                No revenue data available
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
