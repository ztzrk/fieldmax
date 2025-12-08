import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

function ConfirmationDialog({
    trigger,
    title,
    description,
    onConfirm,
}: {
    trigger: React.ReactNode;
    title: string;
    description: string;
    onConfirm: () => void;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button variant="destructive">Delete</Button>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmationDialog;
