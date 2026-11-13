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
        <div className="flex items-center space-x-2 rounded-lg border p-4 shadow-sm">
            <Switch
                id="field-closure"
                checked={isClosed}
                onCheckedChange={handleToggle}
                disabled={isPending}
            />
            <Label htmlFor="field-closure" className="text-base font-medium">
                {isClosed ? "Lapangan Ditutup" : "Lapangan Dibuka"}
            </Label>

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
