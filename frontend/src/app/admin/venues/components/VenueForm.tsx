"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenueFormSchema, venueSchema } from "@/lib/schema/venue.schema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/InputField";
import { useAuth } from "@/context/AuthContext";
import { VenueScheduleForm } from "./VenueScheduleForm";
import { formatTime } from "@/lib/utils";

interface VenueFormProps {
    initialData?: Partial<VenueFormSchema>;
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
    const isRenter = user?.role === "RENTER";

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
                    label="Venue Name"
                    placeholder="Bintang Futsal"
                    required
                />
                <InputField
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Kalibaru Street No. 10"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        control={form.control}
                        name="city"
                        label="City"
                        placeholder="Surabaya"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="district"
                        label="District"
                        placeholder="Rungkut"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        control={form.control}
                        name="province"
                        label="Province"
                        placeholder="East Java"
                        required
                    />
                    <InputField
                        control={form.control}
                        name="postalCode"
                        label="Postal Code"
                        placeholder="60293"
                        required
                    />
                </div>

                <InputField
                    control={form.control}
                    name="description"
                    label="Description"
                    placeholder="A brief description about the venue"
                />
                <VenueScheduleForm />
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
    );
}
