import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPageWrapperProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    isLoading?: boolean;
    className?: string;
}

export function AdminPageWrapper({
    title,
    subtitle,
    actions,
    children,
    isLoading = false,
    className,
}: AdminPageWrapperProps) {
    if (isLoading) {
        return <AdminPageSkeleton />;
    }

    return (
        <div className={cn("space-y-6", className)}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-muted-foreground">{subtitle}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-2">{actions}</div>
                )}
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function AdminPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
            </div>
        </div>
    );
}
