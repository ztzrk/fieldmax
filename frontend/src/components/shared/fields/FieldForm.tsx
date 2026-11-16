"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/InputField";
import { TextareaField } from "@/components/shared/form/TextareaField";
import { ComboboxField } from "@/components/shared/form/ComboboxField";
import { fieldFormSchema, FieldFormSchema } from "@/lib/schema/field.schema";
import { Loader2, Save } from "lucide-react";

interface FieldFormProps {
    initialData?: Partial<FieldFormSchema>;
    onSubmit: (values: FieldFormSchema) => void;
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

    const form = useForm<FieldFormSchema>({
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        <div className="h-10 w-full animate-pulse rounded bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        <div className="h-10 w-full animate-pulse rounded bg-muted" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-24 w-full animate-pulse rounded bg-muted" />
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    control={form.control}
                    name="name"
                    label="Nama Lapangan"
                    placeholder="Contoh: Lapangan Futsal A"
                    required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        control={form.control}
                        name="pricePerHour"
                        label="Harga Sewa per Jam (Rp)"
                        type="number"
                        placeholder="100000"
                        required
                    />
                    <ComboboxField
                        control={form.control}
                        name="sportTypeId"
                        label="Cabang Olahraga"
                        placeholder="Pilih cabang olahraga"
                        options={sportTypeOptions}
                        required
                    />
                </div>
                <TextareaField
                    control={form.control}
                    name="description"
                    label="Deskripsi (Opsional)"
                    placeholder="Ceritakan keunggulan, jenis lantai, ukuran lapangan, atau fasilitas tambahan..."
                    className="min-h-[110px] resize-none"
                />
                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto min-w-[160px]"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
