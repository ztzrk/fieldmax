"use client";

import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface ReportAttachmentInputProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    disabled?: boolean;
    compact?: boolean;
}

export function ReportAttachmentInput({
    file,
    onFileChange,
    disabled = false,
    compact = false,
}: ReportAttachmentInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const previewUrl = useMemo(() => {
        if (!file) return null;
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!ALLOWED_TYPES.includes(selected.type)) {
            toast.error("Format berkas harus JPEG, PNG, atau WebP.");
            e.target.value = "";
            return;
        }

        if (selected.size > MAX_SIZE_BYTES) {
            toast.error("Ukuran gambar maksimal 5 MB.");
            e.target.value = "";
            return;
        }

        onFileChange(selected);
        e.target.value = "";
    };

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleSelect}
                disabled={disabled}
            />

            {!file ? (
                <Button
                    type="button"
                    variant="outline"
                    size={compact ? "sm" : "default"}
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                    className={
                        compact
                            ? "gap-2 text-muted-foreground whitespace-normal h-auto min-h-8 py-1.5"
                            : "w-full gap-2 text-muted-foreground border-dashed whitespace-normal h-auto min-h-10 py-2.5 px-3 text-center leading-snug"
                    }
                >
                    <ImagePlus className="h-4 w-4 shrink-0" />
                    <span>
                        {compact
                            ? "Lampirkan Gambar"
                            : "Lampirkan Bukti Gambar (Opsional, maks. 5 MB)"}
                    </span>
                </Button>
            ) : (
                <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/40">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Pratinjau lampiran"
                            className="h-12 w-12 rounded object-cover border border-border shrink-0"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                            {file.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            {(file.size / 1024).toFixed(0)} KB
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => onFileChange(null)}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Hapus lampiran</span>
                    </Button>
                </div>
            )}
        </div>
    );
}

export function ReportAttachmentPreview({
    url,
    compact = false,
}: {
    url?: string | null;
    compact?: boolean;
}) {
    if (!url) return null;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative inline-block overflow-hidden rounded-lg border border-border/70 bg-muted/30 ${
                compact ? "mt-2 max-w-[240px]" : "mt-3 max-w-sm"
            }`}
        >
            <img
                src={url}
                alt="Lampiran laporan"
                className={`object-cover transition-transform duration-200 group-hover:scale-[1.02] ${
                    compact ? "max-h-48 w-auto" : "max-h-64 w-auto"
                }`}
            />
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-background/85 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-sm">
                <ExternalLink className="h-3 w-3" />
                Buka
            </span>
        </a>
    );
}
