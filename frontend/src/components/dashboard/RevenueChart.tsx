"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
} from "@/components/ui/chart";
import { cn, formatCurrency } from "@/lib/utils";

export type ChartRange = "7d" | "30d" | "12m";
type ChartMetric = "total" | "count";

export interface RevenueChartPoint {
    date: string;
    total: number;
    count?: number;
}

interface RevenueChartProps {
    data: RevenueChartPoint[];
    title?: string;
    range?: ChartRange;
    onRangeChange?: (range: ChartRange) => void;
    headerAction?: React.ReactNode;
}

const RANGE_OPTIONS: { value: ChartRange; label: string }[] = [
    { value: "7d", label: "7 Hari" },
    { value: "30d", label: "30 Hari" },
    { value: "12m", label: "12 Bulan" },
];

const chartConfig = {
    total: {
        label: "Pendapatan",
        color: "var(--primary)",
    },
    count: {
        label: "Transaksi",
        color: "var(--chart-2)",
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

interface CustomTooltipPayloadItem {
    payload?: RevenueChartPoint;
    value?: number;
}

function RevenueTooltipContent({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: CustomTooltipPayloadItem[];
    label?: string;
}) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const point = payload[0]?.payload;
    if (!point) return null;

    return (
        <div className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-md">
            <div className="text-xs font-semibold text-foreground mb-1.5">
                {label || point.date}
            </div>
            <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        Pendapatan
                    </span>
                    <span className="font-semibold text-foreground tabular-nums">
                        {formatCurrency(point.total || 0)}
                    </span>
                </div>
                {typeof point.count === "number" && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: "var(--chart-2)" }}
                            />
                            Transaksi
                        </span>
                        <span className="font-semibold text-foreground tabular-nums">
                            {point.count} pesanan
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Revenue & transaction volume trend chart shared by Admin and Renter dashboards.
 * Features metric switcher (Pendapatan vs Transaksi), segmented time range selector,
 * Indonesian currency formatting, and an explicit empty state.
 */
export function RevenueChart({
    data,
    title = "Grafik Pendapatan",
    range,
    onRangeChange,
    headerAction,
}: RevenueChartProps) {
    const [metric, setMetric] = useState<ChartMetric>("total");

    const hasCountData = useMemo(
        () => data.some((item) => typeof item.count === "number"),
        [data]
    );

    const { periodTotal, periodCount } = useMemo(
        () =>
            data.reduce(
                (acc, item) => ({
                    periodTotal: acc.periodTotal + (Number(item.total) || 0),
                    periodCount: acc.periodCount + (Number(item.count) || 0),
                }),
                { periodTotal: 0, periodCount: 0 }
            ),
        [data]
    );

    const isEmpty = data.length === 0 || (periodTotal === 0 && periodCount === 0);
    const activeMetric: ChartMetric = hasCountData ? metric : "total";
    const xAxisInterval = data.length > 14 ? 4 : 0;

    return (
        <Card className="rounded-xl border border-border/70 bg-card h-full flex flex-col">
            <CardHeader className="pb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-border/50">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                        {title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>
                            Total periode:{" "}
                            <strong className="font-semibold text-foreground tabular-nums">
                                {formatCurrency(periodTotal)}
                            </strong>
                        </span>
                        {hasCountData && (
                            <>
                                <span aria-hidden="true" className="text-border">
                                    •
                                </span>
                                <span>
                                    Volume:{" "}
                                    <strong className="font-semibold text-foreground tabular-nums">
                                        {periodCount} transaksi lunas
                                    </strong>
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {hasCountData && (
                        <div
                            role="group"
                            aria-label="Pilih metrik grafik"
                            className="inline-flex items-center rounded-lg bg-muted/70 p-0.5 border border-border/60"
                        >
                            <button
                                type="button"
                                onClick={() => setMetric("total")}
                                className={cn(
                                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                                    activeMetric === "total"
                                        ? "bg-background text-foreground shadow-2xs"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Pendapatan
                            </button>
                            <button
                                type="button"
                                onClick={() => setMetric("count")}
                                className={cn(
                                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                                    activeMetric === "count"
                                        ? "bg-background text-foreground shadow-2xs"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Transaksi
                            </button>
                        </div>
                    )}

                    {range && onRangeChange ? (
                        <div
                            role="group"
                            aria-label="Pilih rentang waktu grafik"
                            className="inline-flex items-center rounded-lg bg-muted/70 p-0.5 border border-border/60"
                        >
                            {RANGE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => onRangeChange(opt.value)}
                                    className={cn(
                                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                                        range === opt.value
                                            ? "bg-primary text-primary-foreground shadow-2xs"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        headerAction
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-5 flex-1 flex flex-col justify-center">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-muted/20 p-8 text-center min-h-[250px]">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                            <BarChart3 className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                            Belum ada transaksi lunas pada rentang ini
                        </p>
                        <p className="text-xs text-muted-foreground max-w-xs mt-1">
                            Data pendapatan dan jumlah pesanan lunas akan otomatis
                            ditampilkan di grafik ini.
                        </p>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="min-h-[250px] max-h-[290px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={data}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="fillRevenuePrimary"
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
                                <linearGradient
                                    id="fillCountInfo"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="var(--chart-2)"
                                        stopOpacity={0.95}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--chart-2)"
                                        stopOpacity={0.55}
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
                                interval={xAxisInterval}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={activeMetric === "total" ? 68 : 36}
                                allowDecimals={activeMetric === "total"}
                                tick={{ fontSize: 11 }}
                                tickFormatter={(value) =>
                                    activeMetric === "total"
                                        ? formatCompactRp(Number(value))
                                        : String(value)
                                }
                            />
                            <ChartTooltip
                                cursor={{ fill: "var(--muted)", opacity: 0.45 }}
                                content={<RevenueTooltipContent />}
                            />
                            <Bar
                                dataKey={activeMetric}
                                fill={
                                    activeMetric === "total"
                                        ? "url(#fillRevenuePrimary)"
                                        : "url(#fillCountInfo)"
                                }
                                radius={[5, 5, 0, 0]}
                                maxBarSize={40}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
