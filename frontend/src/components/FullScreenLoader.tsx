"use client";

import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className="absolute h-24 w-24 rounded-full border-4 border-primary/20 animate-ping opacity-75" />

                {/* Rotating outer border */}
                <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin duration-1000" />

                {/* Inner Icon */}
                <div className="absolute">
                    <Loader2 className="h-6 w-6 text-primary animate-spin duration-700" />
                </div>
            </div>
            <p className="mt-8 text-sm font-medium text-muted-foreground animate-pulse tracking-widest uppercase">
                Loading
            </p>
        </div>
    );
}
