"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
    SportTypeResponseSchema,
    SportTypeFormSchema,
    sportTypeFormSchema,
} from "@/lib/schema/sportType.schema";
import { InputField } from "@/components/shared/form/InputField";

interface SportTypeFormProps {
    initialData?: Partial<SportTypeResponseSchema>;
    onSubmit: (values: SportTypeFormSchema) => void;
    isPending: boolean;
}

/**
 * Form component for creating or editing a sport type.
 * Handles validation using Zod and submission via callbacks.
 */
export function SportTypeForm({
    initialData,
    onSubmit,
    isPending,
}: SportTypeFormProps) {
    const form = useForm<SportTypeFormSchema>({
        resolver: zodResolver(sportTypeFormSchema),
        defaultValues: initialData || { name: "" },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="e.g. Football"
                    required
                />
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
}
