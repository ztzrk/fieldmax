"use client";

import { useEffect, useRef, useState } from "react";
import {
    QrCode,
    Camera,
    Keyboard,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCheckInBooking } from "@/hooks/useBookings";
import { formatDate, formatTime } from "@/lib/utils";

export function CheckInScannerDialog() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"camera" | "manual">("camera");
    const [manualCode, setManualCode] = useState("");
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [checkedInBooking, setCheckedInBooking] = useState<any>(null);

    const { mutate: checkIn, isPending } = useCheckInBooking();
    const scannerRef = useRef<any>(null);
    const hasScannedRef = useRef(false);

    const handleVerifyCode = (code: string) => {
        if (!code.trim() || isPending) return;
        setScanError(null);
        checkIn(code.trim(), {
            onSuccess: (res: any) => {
                setCheckedInBooking(res?.data || res);
                setManualCode("");
            },
            onError: (err: any) => {
                const msg =
                    err?.response?.data?.error?.message ||
                    err?.response?.data?.message ||
                    "Gagal melakukan check-in.";
                setScanError(msg);
            },
        });
    };

    useEffect(() => {
        if (!open || mode !== "camera" || checkedInBooking || scanError) return;

        let cancelled = false;
        hasScannedRef.current = false;
        setCameraError(null);

        async function startScanner() {
            try {
                const { Html5Qrcode } = await import("html5-qrcode");
                if (cancelled) return;

                const el = document.getElementById("fieldmax-qr-reader");
                if (!el) return;

                const html5QrCode = new Html5Qrcode("fieldmax-qr-reader");
                scannerRef.current = html5QrCode;

                await html5QrCode.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 220, height: 220 } },
                    (decodedText: string) => {
                        if (hasScannedRef.current) return;
                        hasScannedRef.current = true;
                        handleVerifyCode(decodedText);
                    },
                    () => {
                        // Ignore per-frame decode misses
                    }
                );
            } catch (err: any) {
                if (!cancelled) {
                    setCameraError(
                        "Kamera tidak tersedia atau izin ditolak. Gunakan tab Input Kode Manual."
                    );
                }
            }
        }

        const timer = setTimeout(startScanner, 150);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            const current = scannerRef.current;
            scannerRef.current = null;
            if (current) {
                current
                    .stop()
                    .then(() => current.clear())
                    .catch(() => {});
            }
        };
    }, [open, mode, checkedInBooking, scanError]);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            setCheckedInBooking(null);
            setCameraError(null);
            setScanError(null);
            hasScannedRef.current = false;
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl">
                    <QrCode className="h-4 w-4" />
                    Scan QR Check-In
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Verifikasi Kehadiran (Check-In)</DialogTitle>
                    <DialogDescription>
                        Pindai QR Code tiket pengguna atau masukkan kode tiket
                        secara manual.
                    </DialogDescription>
                </DialogHeader>

                {checkedInBooking ? (
                    <div className="space-y-4 py-2">
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                                <CheckCircle2 className="h-5 w-5" />
                                <span>Check-In Berhasil!</span>
                            </div>
                            <div className="text-sm space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Pelanggan
                                    </span>
                                    <span className="font-medium">
                                        {checkedInBooking.user?.fullName || "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Lapangan
                                    </span>
                                    <span className="font-medium">
                                        {checkedInBooking.field?.name || "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Jadwal
                                    </span>
                                    <span className="font-medium">
                                        {formatDate(
                                            checkedInBooking.bookingDate
                                        )}{" "}
                                        ({formatTime(checkedInBooking.startTime)}{" "}
                                        – {formatTime(checkedInBooking.endTime)}
                                        )
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setCheckedInBooking(null);
                                    hasScannedRef.current = false;
                                }}
                            >
                                Scan Tiket Lain
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => handleOpenChange(false)}
                            >
                                Selesai
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Tabs
                        value={mode}
                        onValueChange={(v) => setMode(v as "camera" | "manual")}
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="camera" className="gap-1.5">
                                <Camera className="h-4 w-4" />
                                Kamera QR
                            </TabsTrigger>
                            <TabsTrigger value="manual" className="gap-1.5">
                                <Keyboard className="h-4 w-4" />
                                Input Manual
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="camera" className="mt-4">
                            {scanError ? (
                                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-center space-y-4">
                                    <div className="flex flex-col items-center gap-2 text-destructive">
                                        <AlertCircle className="h-7 w-7" />
                                        <p className="text-sm font-medium">
                                            {scanError}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => {
                                            setScanError(null);
                                            hasScannedRef.current = false;
                                        }}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Coba Scan Lagi
                                    </Button>
                                </div>
                            ) : cameraError ? (
                                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    {cameraError}
                                </div>
                            ) : (
                                <div
                                    id="fieldmax-qr-reader"
                                    className="w-full overflow-hidden rounded-xl border bg-muted/20 min-h-[260px]"
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="manual" className="mt-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleVerifyCode(manualCode);
                                }}
                                className="space-y-4"
                            >
                                <Input
                                    placeholder="Masukkan Kode Tiket (cth. #ABCD1234 atau UUID)"
                                    value={manualCode}
                                    onChange={(e) =>
                                        setManualCode(e.target.value)
                                    }
                                    disabled={isPending}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!manualCode.trim() || isPending}
                                >
                                    {isPending
                                        ? "Memverifikasi..."
                                        : "Konfirmasi Check-In"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    );
}
