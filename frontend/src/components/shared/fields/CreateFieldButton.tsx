"use client";

import { useState } from "react";
import { useCreateField } from "@/hooks/useFields";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FieldForm } from "./FieldForm";
import { FieldFormSchema } from "@/lib/schema/field.schema";

interface CreateFieldButtonProps {
    venueId: string;
}

/**
 * CreateFieldButton Component
 *
 * Button that triggers a modal dialog for creating a new field.
 * Reuse FieldForm for the creation logic.
 */
export function CreateFieldButton({ venueId }: CreateFieldButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: createField, isPending } = useCreateField();

    const handleSubmit = (values: FieldFormSchema) => {
        createField(
            { ...values, venueId: venueId },
            {
                onSuccess: () => {
                    setIsOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create Field</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Field</DialogTitle>
                </DialogHeader>
                <FieldForm onSubmit={handleSubmit} isPending={isPending} />
            </DialogContent>
        </Dialog>
    );
}
