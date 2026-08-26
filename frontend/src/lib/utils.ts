import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

export function formatDate(
    date: string | Date,
    dateFormat: string = "PPP"
): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatTime(time: string | Date): string {
    if (!time) return "N/A";

    if (time instanceof Date) {
        if (isNaN(time.getTime())) return "N/A";
        return time.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    const str = String(time).trim();
    const timeMatch = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (timeMatch) {
        const h = parseInt(timeMatch[1], 10);
        const m = timeMatch[2];
        const period = h >= 12 ? "PM" : "AM";
        const displayH = h % 12 || 12;
        return `${displayH}:${m} ${period}`;
    }

    if (str.includes("T")) {
        const timePartMatch = str.match(/T(\d{2}):(\d{2})/);
        if (timePartMatch) {
            const h = parseInt(timePartMatch[1], 10);
            const m = timePartMatch[2];
            const period = h >= 12 ? "PM" : "AM";
            const displayH = h % 12 || 12;
            return `${displayH}:${m} ${period}`;
        }
    }

    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    return str;
}
