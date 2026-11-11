import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FieldDetailSkeleton() {
    return (
        <div className="container max-w-[1400px] mx-auto py-8 px-4 md:px-6 min-h-screen bg-background pb-20">
            {/* Back button */}
            <div className="mb-6">
                <Skeleton className="h-6 w-20 rounded" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                {/* Left Column (2 spans) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-32 rounded-full" />
                        </div>
                        <Skeleton className="h-10 w-3/4 rounded" />
                        <Skeleton className="h-5 w-1/2 rounded" />
                    </div>

                    {/* Image Carousel aspect-video */}
                    <Skeleton className="w-full aspect-video rounded-2xl" />

                    {/* Description */}
                    <div className="space-y-3 pt-4 border-t">
                        <Skeleton className="h-7 w-40 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-5/6 rounded" />
                        <Skeleton className="h-4 w-2/3 rounded" />
                    </div>

                    {/* Schedule */}
                    <div className="space-y-3 pt-4 border-t">
                        <Skeleton className="h-7 w-48 rounded" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-16 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar booking card) */}
                <div className="lg:col-span-1">
                    <Card className="rounded-2xl border-border/60 shadow-lg p-6 space-y-6">
                        <CardHeader className="p-0 space-y-2">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-9 w-44 rounded" />
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
