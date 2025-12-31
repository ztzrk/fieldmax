import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import React from "react";

interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode;
    text?: string;
    variant?: "simple" | "pattern" | "gradient";
}

/**
 * ImagePlaceholder Component
 *
 * A reusable placeholder component for when images are missing or loading.
 * Supports different visual variants to make UI "more interesting".
 *
 * Variants:
 * - simple: Solid/muted background with icon.
 * - pattern: Dot pattern background.
 * - gradient: Subtle animated gradient.
 */
export function ImagePlaceholder({
    className,
    icon,
    text,
    variant = "simple",
    children,
    ...props
}: ImagePlaceholderProps) {
    const Icon = icon || (
        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
    );

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center w-full h-full overflow-hidden relative",
                {
                    "bg-muted": variant === "simple",
                    "bg-muted/30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]":
                        variant === "pattern",
                    "bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse":
                        variant === "gradient",
                },
                className
            )}
            {...props}
        >
            {/* Optional decorative blurred orb for visual interest in 'pattern' mode */}
            {variant === "pattern" && (
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
            )}

            <div className="z-10 flex flex-col items-center gap-2 p-4 text-center">
                {Icon}
                {text && (
                    <span className="text-sm font-medium text-muted-foreground">
                        {text}
                    </span>
                )}
                {children}
            </div>
        </div>
    );
}
