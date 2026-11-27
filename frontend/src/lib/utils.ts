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
    _dateFormat: string = "PPP"
): string {
    if (!date) return "-";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatTime(time: string | Date): string {
    if (!time) return "-";

    if (time instanceof Date) {
        if (isNaN(time.getTime())) return "-";
        const hours = time.getHours().toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    const str = String(time).trim();
    const timeMatch = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (timeMatch) {
        const h = timeMatch[1].padStart(2, "0");
        const m = timeMatch[2];
        return `${h}:${m}`;
    }

    if (str.includes("T")) {
        const timePartMatch = str.match(/T(\d{2}):(\d{2})/);
        if (timePartMatch) {
            return `${timePartMatch[1]}:${timePartMatch[2]}`;
        }
    }

    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
        const hours = parsed.getHours().toString().padStart(2, "0");
        const minutes = parsed.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    return str;
}
