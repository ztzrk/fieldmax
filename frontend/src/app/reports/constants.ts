import { Report } from "@/services/reports.service";

export const REPORT_CATEGORY_LABELS: Record<Report["category"], string> = {
    SCAM: "Penipuan / Kecurangan",
    TECHNICAL: "Masalah Teknis",
    PAYMENT: "Masalah Pembayaran",
    OTHER: "Lainnya",
};

export const REPORT_CATEGORY_DESCRIPTIONS: Record<Report["category"], string> = {
    SCAM: "Laporkan indikasi penipuan, penyalahgunaan, atau kecurangan",
    TECHNICAL: "Kendala fitur, error aplikasi, atau masalah tampilan",
    PAYMENT: "Kendala transaksi, refund, atau verifikasi pembayaran",
    OTHER: "Pertanyaan umum, saran, atau kendala lainnya",
};

export const REPORT_CATEGORY_STYLES: Record<Report["category"], string> = {
    SCAM: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
    TECHNICAL:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300",
    PAYMENT:
        "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300",
    OTHER: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300",
};

export const REPORT_STATUS_LABELS: Record<Report["status"], string> = {
    PENDING: "Menunggu",
    RESOLVED: "Selesai",
};

export const REPORT_STATUS_STYLES: Record<Report["status"], string> = {
    PENDING:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
    RESOLVED:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
};
