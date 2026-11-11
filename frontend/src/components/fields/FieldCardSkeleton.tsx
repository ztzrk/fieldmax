import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FieldCardSkeleton() {
    return (
        <Card className="h-full flex flex-col p-0 overflow-hidden border-border/50 bg-card">
            <div className="aspect-[4/3] w-full relative">
                <Skeleton className="h-full w-full rounded-none" />
            </div>
            <CardContent className="p-4 flex flex-col flex-1 space-y-3">
                <Skeleton className="h-5 w-4/5 rounded" />
                <Skeleton className="h-3.5 w-1/2 rounded" />
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/30">
                    <Skeleton className="h-6 w-24 rounded" />
                    <Skeleton className="h-5 w-12 rounded" />
                </div>
            </CardContent>
        </Card>
    );
}
