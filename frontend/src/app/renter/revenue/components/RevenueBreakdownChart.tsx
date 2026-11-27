"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

export interface RevenueBreakdownItem {
    name: string;
    subtitle?: string;
    totalRevenue: number;
    bookingCount: number;
}

interface RevenueBreakdownChartProps {
    data: RevenueBreakdownItem[];
    title: string;
    description: string;
    emptyMessage?: string;
}

const chartConfig = {
    totalRevenue: {
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

function BreakdownTooltipContent({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { payload?: RevenueBreakdownItem }[];
}) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const item = payload[0]?.payload;
    if (!item) return null;

    return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md">
            <div className="text-xs font-semibold text-foreground">
                {item.name}
            </div>
            {item.subtitle && (
                <div className="text-[11px] text-muted-foreground mb-1.5">
                    {item.subtitle}
                </div>
            )}
            <div className="space-y-1 text-xs pt-1 border-t border-border/50">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Pendapatan</span>
                    <span className="font-semibold text-foreground tabular-nums">
                        {formatCurrency(item.totalRevenue)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Pesanan Lunas</span>
                    <span className="font-semibold text-foreground tabular-nums">
                        {item.bookingCount} transaksi
                    </span>
                </div>
            </div>
        </div>
    );
}

/**
 * Reusable bar chart comparing revenue across fields or venues
 * with currency formatting, booking count tooltip, and explicit empty state.
 */
export function RevenueBreakdownChart({
    data,
    title,
    description,
    emptyMessage = "Belum ada pendapatan lunas pada periode atau tempat olahraga terpilih.",
}: RevenueBreakdownChartProps) {
    const hasRevenue = useMemo(
        () => data.some((item) => item.totalRevenue > 0),
        [data]
    );

    return (
        <Card className="rounded-xl border border-border/70 bg-card">
            <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <CardDescription className="text-xs">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
                {data.length === 0 || !hasRevenue ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 p-8 text-center min-h-[240px]">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                            <BarChart3 className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            Belum ada data untuk divisualisasikan
                        </p>
                        <p className="text-xs text-muted-foreground max-w-sm mt-1">
                            {emptyMessage}
                        </p>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="min-h-[260px] max-h-[300px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={data}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="fillBreakdownPrimary"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--primary)"
                                        stopOpacity={0.95}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--primary)"
                                        stopOpacity={0.55}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                className="stroke-border/60"
                            />
                            <XAxis
                                dataKey="name"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                width={68}
                                tickFormatter={(value) =>
                                    formatCompactRp(Number(value))
                                }
                            />
                            <ChartTooltip
                                cursor={{ fill: "var(--muted)", opacity: 0.45 }}
                                content={<BreakdownTooltipContent />}
                            />
                            <Bar
                                dataKey="totalRevenue"
                                fill="url(#fillBreakdownPrimary)"
                                radius={[5, 5, 0, 0]}
                                maxBarSize={44}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
