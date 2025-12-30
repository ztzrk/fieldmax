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
import FieldService from "@/services/field.service";

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

    const handleToggle = (checked: boolean) => {
        setPendingState(checked);
        setShowConfirm(true);
    };

    const confirmToggle = async () => {
        try {
            await FieldService.toggleClosure(fieldId, pendingState);
            setIsClosed(pendingState);
            toast.success(
                `Field successfully ${pendingState ? "closed" : "opened"}`
            );
        } catch (error) {
            toast.error("Failed to update field closure status");
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
            />
            <Label htmlFor="field-closure" className="text-base font-medium">
                {isClosed ? "Field is Closed" : "Field is Open"}
            </Label>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingState ? "Close Field?" : "Open Field?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingState
                                ? "This will make the field unavailable for new bookings. Existing bookings may need to be cancelled manually."
                                : "This will make the field available for bookings again based on its schedule."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmToggle}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
