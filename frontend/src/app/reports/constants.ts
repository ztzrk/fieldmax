import { Report } from "@/services/reports.service";
import { STATUS_TONE_STYLES } from "@/components/shared/StatusBadge";

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
    SCAM: STATUS_TONE_STYLES.destructive,
    TECHNICAL: STATUS_TONE_STYLES.info,
    PAYMENT: STATUS_TONE_STYLES.warning,
    OTHER: STATUS_TONE_STYLES.neutral,
};

export const REPORT_STATUS_LABELS: Record<Report["status"], string> = {
    PENDING: "Menunggu",
    IN_PROGRESS: "Sedang Ditangani",
    RESOLVED: "Selesai",
};

export const REPORT_STATUS_STYLES: Record<Report["status"], string> = {
    PENDING: STATUS_TONE_STYLES.warning,
    IN_PROGRESS: STATUS_TONE_STYLES.info,
    RESOLVED: STATUS_TONE_STYLES.success,
};
