import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone =
    | "success"
    | "warning"
    | "info"
    | "destructive"
    | "neutral";

/**
 * Shared Tailwind v4 style classes mapped to semantic status tokens in globals.css.
 */
export const STATUS_TONE_STYLES: Record<StatusTone, string> = {
    success:
        "border-status-success/25 bg-status-success/10 text-status-success",
    warning:
        "border-status-warning/25 bg-status-warning/10 text-status-warning",
    info: "border-status-info/25 bg-status-info/10 text-status-info",
    destructive:
        "border-destructive/25 bg-destructive/10 text-destructive",
    neutral: "border-border bg-muted text-muted-foreground",
};

export const STATUS_DOT_STYLES: Record<StatusTone, string> = {
    success: "bg-status-success",
    warning: "bg-status-warning",
    info: "bg-status-info",
    destructive: "bg-destructive",
    neutral: "bg-muted-foreground",
};

export const APPROVAL_STATUS_META: Record<
    "DRAFT" | "PENDING" | "APPROVED" | "REJECTED",
    { label: string; tone: StatusTone }
> = {
    DRAFT: { label: "Draf", tone: "neutral" },
    PENDING: { label: "Menunggu Verifikasi", tone: "warning" },
    APPROVED: { label: "Disetujui", tone: "success" },
    REJECTED: { label: "Ditolak", tone: "destructive" },
};

export const BOOKING_STATUS_META: Record<
    string,
    { label: string; tone: StatusTone }
> = {
    PENDING: { label: "Menunggu", tone: "warning" },
    CONFIRMED: { label: "Dikonfirmasi", tone: "success" },
    COMPLETED: { label: "Selesai", tone: "info" },
    CANCELLED: { label: "Dibatalkan", tone: "destructive" },
    NO_SHOW: { label: "Tidak Hadir", tone: "neutral" },
};

export const PAYMENT_STATUS_META: Record<
    string,
    { label: string; tone: StatusTone }
> = {
    PAID: { label: "Lunas", tone: "success" },
    PENDING: { label: "Menunggu Pembayaran", tone: "warning" },
    EXPIRED: { label: "Kedaluwarsa", tone: "neutral" },
    FAILED: { label: "Gagal", tone: "destructive" },
};

export const USER_ROLE_META: Record<
    string,
    { label: string; tone: StatusTone }
> = {
    ADMIN: { label: "Admin", tone: "info" },
    RENTER: { label: "Mitra", tone: "success" },
    USER: { label: "Pengguna", tone: "neutral" },
};

interface StatusBadgeProps {
    label: string;
    tone?: StatusTone;
    dot?: boolean;
    pulseDot?: boolean;
    className?: string;
}

/**
 * StatusBadge Component
 *
 * Semantic status pill backed by DESIGN.md v2.0 status tokens.
 */
export function StatusBadge({
    label,
    tone = "neutral",
    dot = false,
    pulseDot = false,
    className,
}: StatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(STATUS_TONE_STYLES[tone], className)}
        >
            {dot && (
                <span
                    className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        STATUS_DOT_STYLES[tone],
                        pulseDot && "animate-pulse motion-reduce:animate-none"
                    )}
                />
            )}
            {label}
        </Badge>
    );
}
