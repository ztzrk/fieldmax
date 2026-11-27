"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    VenueFormSchema,
    venueSchema,
    VenueResponseSchema,
    VenueDetailResponseSchema,
} from "@/lib/schema/venue.schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/InputField";
import { TextareaField } from "@/components/shared/form/TextareaField";
import { useAuth } from "@/context/AuthContext";
import { VenueScheduleForm } from "./VenueScheduleForm";
import { ComboboxField } from "@/components/shared/form/ComboboxField";
import { useMemo, useState } from "react";
import { useGetRenters } from "@/hooks/useUsers";

interface VenueFormProps {
    initialData?:
        | Partial<VenueFormSchema>
        | Partial<VenueDetailResponseSchema>
        | (Partial<VenueResponseSchema> & { schedules?: any[] });
    onSubmit: (values: VenueFormSchema) => void;
    isPending: boolean;
}

/**
 * Form component for creating or editing a venue.
 * Handles validation, schedule formatting, and submission.
 */
const formatToHHMM = (dateStr: string | Date) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

export function VenueForm({
    initialData,
    onSubmit,
    isPending,
}: VenueFormProps) {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const isRenter = user?.role === "RENTER";

    // Search state for renters combobox
    const [renterSearch, setRenterSearch] = useState("");
    const { data: rentersData } = useGetRenters(renterSearch);

    const renters = useMemo(() => {
        const fetched =
            rentersData?.map((renter: any) => ({
                label: `${renter.fullName} (${renter.email})`,
                value: renter.id,
            })) || [];

        const initialRenterId = initialData?.renterId;
        const initialRenter =
            initialData && "renter" in initialData ? initialData.renter : null;

        if (
            initialRenterId &&
            initialRenter &&
            !fetched.some((opt: any) => opt.value === initialRenterId)
        ) {
            const label = initialRenter.email
                ? `${initialRenter.fullName} (${initialRenter.email})`
                : initialRenter.fullName;
            return [{ label, value: initialRenterId }, ...fetched];
        }

        return fetched;
    }, [rentersData, initialData]);

    const formattedSchedules =
        initialData?.schedules?.map((s) => ({
            ...s,
            openTime: formatToHHMM(s.openTime),
            closeTime: formatToHHMM(s.closeTime),
        })) || [];

    const form = useForm<VenueFormSchema>({
        resolver: zodResolver(venueSchema),
        defaultValues: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
            district: initialData?.district || "",
            province: initialData?.province || "",
            postalCode: initialData?.postalCode || "",
            renterId:
                initialData?.renterId || (isRenter && user ? user.id : ""),
            description: initialData?.description || "",
            schedules: formattedSchedules,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    control={form.control}
                    name="name"
                    label="Nama Tempat Olahraga"
                    placeholder="Bintang Futsal"
                    required
                />
                <InputField
                    control={form.control}
                    name="address"
                    label="Alamat"
                    placeholder="Jl. Kalibaru No. 10"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        control={form.control}
                        name="city"
                        label="Kota"
                        placeholder="Surabaya"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="district"
                        label="Kecamatan"
                        placeholder="Rungkut"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        control={form.control}
                        name="province"
                        label="Provinsi"
                        placeholder="Jawa Timur"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="postalCode"
                        label="Kode Pos"
                        placeholder="60293"
                        required
                    />
                </div>

                <TextareaField
                    control={form.control}
                    name="description"
                    label="Deskripsi"
                    placeholder="Deskripsi singkat tentang tempat olahraga, fasilitas, dan keunggulannya"
                    className="min-h-[100px]"
                />
                {isAdmin && (
                    <ComboboxField
                        control={form.control}
                        name="renterId"
                        label="Mitra"
                        placeholder="Pilih mitra"
                        options={renters}
                        onSearchChange={setRenterSearch}
                    />
                )}
                <VenueScheduleForm />
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
            </form>
        </Form>
    );
}
