"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type IconTone = "primary" | "info" | "success" | "warning" | "neutral";

const ICON_TONE_CLASSES: Record<IconTone, string> = {
    primary: "bg-primary/10 text-primary",
    info: "bg-status-info/10 text-status-info",
    success: "bg-status-success/10 text-status-success",
    warning: "bg-status-warning/10 text-status-warning",
    neutral: "bg-muted text-muted-foreground",
};

interface DashboardKpiCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    iconTone?: IconTone;
    valueTone?: "default" | "primary";
    deltaPct?: number | null;
    deltaLabel?: string;
    subtitle?: React.ReactNode;
    href?: string;
    className?: string;
}

/**
 * Standardized KPI metric card for Operate-mode Admin and Renter dashboards.
 * Supports period-over-period delta indicators, tabular numerals, and drill-down links.
 */
export function DashboardKpiCard({
    title,
    value,
    unit,
    icon: Icon,
    iconTone = "primary",
    valueTone = "default",
    deltaPct,
    deltaLabel = "vs bulan lalu",
    subtitle,
    href,
    className,
}: DashboardKpiCardProps) {
    const hasDelta = deltaPct !== undefined && deltaPct !== null;
    const isPositive = hasDelta && deltaPct >= 0;

    const cardBody = (
        <Card
            className={cn(
                "h-full rounded-xl border border-border/70 bg-card transition-colors duration-150",
                href && "group-hover:border-primary/50",
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg shrink-0", ICON_TONE_CLASSES[iconTone])}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span
                        className={cn(
                            "text-2xl sm:text-3xl font-bold tracking-tight tabular-nums",
                            valueTone === "primary" ? "text-primary" : "text-foreground"
                        )}
                    >
                        {value}
                    </span>
                    {unit && (
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                            {unit}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground min-h-[18px]">
                    <div className="flex items-center flex-wrap gap-x-1.5 gap-y-0.5 min-w-0">
                        {hasDelta && (
                            <span
                                className={cn(
                                    "inline-flex items-center font-semibold tabular-nums",
                                    isPositive
                                        ? "text-status-success"
                                        : "text-destructive"
                                )}
                            >
                                {isPositive ? (
                                    <ArrowUpRight className="h-3.5 w-3.5 mr-0.5 shrink-0" />
                                ) : (
                                    <ArrowDownRight className="h-3.5 w-3.5 mr-0.5 shrink-0" />
                                )}
                                {isPositive ? "+" : ""}
                                {deltaPct}%
                            </span>
                        )}
                        {hasDelta && deltaLabel && (
                            <span className="text-muted-foreground/80">
                                {deltaLabel}
                            </span>
                        )}
                        {!hasDelta && subtitle && (
                            <span className="truncate">{subtitle}</span>
                        )}
                    </div>

                    {href && (
                        <ArrowRight
                            className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-primary transition-all duration-150"
                            aria-hidden="true"
                        />
                    )}
                </div>

                {hasDelta && subtitle && (
                    <div className="text-xs text-muted-foreground truncate pt-0.5 border-t border-border/50">
                        {subtitle}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (href) {
        return (
            <Link
                href={href}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                {cardBody}
            </Link>
        );
    }

    return cardBody;
}
