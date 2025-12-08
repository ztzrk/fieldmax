"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllSportTypes } from "@/hooks/useSportTypes";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/InputField";
import { SelectField } from "@/components/shared/form/SelectField";
import { fieldFormSchema, FieldFormValues } from "@/lib/schema/field.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";

interface FieldFormProps {
    initialData?: Partial<FieldFormValues>;
    onSubmit: (values: FieldFormValues) => void;
    isPending: boolean;
}

export function FieldForm({
    initialData,
    onSubmit,
    isPending,
}: FieldFormProps) {
    const { data: sportTypes, isLoading: isLoadingSportTypes } =
        useGetAllSportTypes();

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
        return <FullScreenLoader />;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    control={form.control}
                    name="name"
                    label="Field Name"
                />
                <InputField
                    control={form.control}
                    name="pricePerHour"
                    label="Price per Hour"
                    type="number"
                />
                <SelectField
                    control={form.control}
                    name="sportTypeId"
                    label="Sport Type"
                    placeholder="Select a sport type"
                    options={sportTypeOptions}
                />
                <InputField
                    control={form.control}
                    name="description"
                    label="Description (Optional)"
                />
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
}
