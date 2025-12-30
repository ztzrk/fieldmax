"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/InputField";
import { ComboboxField } from "@/components/shared/form/ComboboxField";

import { fieldFormSchema, FieldFormValues } from "@/lib/schema/field.schema";


interface FieldFormProps {
    initialData?: Partial<FieldFormValues>;
    onSubmit: (values: FieldFormValues) => void;
    isPending: boolean;
}

/**
 * FieldForm Component
 * 
 * Form for creating and editing sports fields. Handles validation using Zod schema,
 * sport type selection, and submission logic.
 */
export function FieldForm({
    initialData,
    onSubmit,
    isPending,
}: FieldFormProps) {
    const { data: sportTypes, isLoading: isLoadingSportTypes } =
        useGetAllSportTypesWithoutPagination();

    const sportTypeOptions =
        sportTypes?.map((st: { id: string; name: string }) => ({
            value: st.id,
            label: st.name,
        })) || [];

    const form = useForm<FieldFormValues>({
        resolver: zodResolver(fieldFormSchema),
        defaultValues: initialData || {
            name: "",
            pricePerHour: 0,
            sportTypeId: "",
            description: "",
        },
    });

    if (isLoadingSportTypes) {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    control={form.control}
                    name="name"
                    label="Field Name"
                    placeholder="Field A"
                />
                <InputField
                    control={form.control}
                    name="pricePerHour"
                    label="Price per Hour"
                    type="number"
                    placeholder="100000"
                />
                <ComboboxField
                    control={form.control}
                    name="sportTypeId"
                    label="Sport Type"
                    placeholder="Select a sport type"
                    options={sportTypeOptions}
                />
                <InputField
                    control={form.control}
                    name = "description"
                    label="Description (Optional)"
                    placeholder="A brief description about the field"
                />
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
}
