"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useToggleFieldClosure } from "@/hooks/useFields";

interface FieldClosureSwitchProps {
    fieldId: string;
    initialIsClosed: boolean;
}

/**
 * FieldClosureSwitch Component
 *
 * Toggle switch to open/close a field manually.
 * Includes a confirmation dialog to prevent accidental closure.
 */
export default function FieldClosureSwitch({
    fieldId,
    initialIsClosed,
}: FieldClosureSwitchProps) {
    const [isClosed, setIsClosed] = useState(initialIsClosed);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingState, setPendingState] = useState(false);
    const { mutateAsync: toggleClosure, isPending } = useToggleFieldClosure(fieldId);

    const handleToggle = (checked: boolean) => {
        setPendingState(checked);
        setShowConfirm(true);
    };

    const confirmToggle = async () => {
        try {
            await toggleClosure(pendingState);
            setIsClosed(pendingState);
            toast.success(
                `Lapangan berhasil ${pendingState ? "ditutup" : "dibuka"}`
            );
        } catch (error) {
            toast.error("Gagal memperbarui status operasional lapangan");
            console.error(error);
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/60 p-4">
            <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${
                            isClosed ? "bg-red-500" : "bg-emerald-500"
                        }`}
                    />
                    <Label
                        htmlFor="field-closure"
                        className="text-sm font-semibold cursor-pointer"
                    >
                        {isClosed ? "Lapangan Ditutup" : "Lapangan Dibuka"}
                    </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                    {isClosed
                        ? "Sementara tidak dapat dipesan pelanggan."
                        : "Aktif dan siap menerima pemesanan."}
                </p>
            </div>
            <Switch
                id="field-closure"
                checked={isClosed}
                onCheckedChange={handleToggle}
                disabled={isPending}
            />

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingState ? "Tutup Lapangan?" : "Buka Lapangan?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingState
                                ? "Tindakan ini akan membuat lapangan tidak dapat dipesan untuk jadwal baru. Pemesanan yang telah dikonfirmasi dapat dibatalkan secara manual jika perlu."
                                : "Tindakan ini akan mengaktifkan kembali lapangan agar dapat dipesan sesuai jadwal operasional."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmToggle} disabled={isPending}>
                            Konfirmasi
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
