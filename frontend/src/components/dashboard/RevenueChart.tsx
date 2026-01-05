"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface RevenueChartProps {
    data: { date: string; total: number }[];
    title?: string;
}

const chartConfig = {
    total: {
        label: "Revenue",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function RevenueChart({
    data,
    title = "Revenue Overview",
}: RevenueChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="min-h-[200px] w-full"
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
                                    stopColor="#f59e0b"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#ea580c"
                                    stopOpacity={0.8}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="total"
                            fill="url(#fillTotal)"
                            radius={8}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
