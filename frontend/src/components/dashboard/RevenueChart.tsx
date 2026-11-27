"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
    data: { date: string; total: number }[];
    title?: string;
    headerAction?: React.ReactNode;
}

const chartConfig = {
    total: {
        label: "Pendapatan",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

function formatCompactRp(value: number) {
    if (value >= 1_000_000) {
        return `Rp ${(value / 1_000_000).toFixed(1).replace(".0", "")}jt`;
    }
    if (value >= 1_000) {
        return `Rp ${Math.round(value / 1_000)}rb`;
    }
    return `Rp ${value}`;
}

export function RevenueChart({
    data,
    title = "Ringkasan Pendapatan",
    headerAction,
}: RevenueChartProps) {
    const periodTotal = useMemo(
        () => data.reduce((acc, item) => acc + (Number(item.total) || 0), 0),
        [data]
    );

    return (
        <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        {title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        Total periode:{" "}
                        <span className="font-semibold text-foreground tabular-nums">
                            {formatCurrency(periodTotal)}
                        </span>
                    </p>
                </div>
                {headerAction}
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="min-h-[240px] max-h-[280px] w-full"
                >
                    <BarChart accessibilityLayer data={data}>
                        <defs>
                            <linearGradient
                                id="fillTotal"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--chart-1)"
                                    stopOpacity={0.9}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--chart-2)"
                                    stopOpacity={0.85}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                            className="stroke-border/60"
                        />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={68}
                            tickFormatter={(value) =>
                                formatCompactRp(Number(value))
                            }
                        />
                        <ChartTooltip
                            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="total"
                            fill="url(#fillTotal)"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
