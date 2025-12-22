"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenueFormValues, venueSchema } from "@/lib/schema/venue.schema";
import { useGetAllUsersWithoutPagination } from "@/hooks/useUsers";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/shared/form/InputField";
import { SelectField } from "@/components/shared/form/SelectField";
import { useAuth } from "@/context/AuthContext";
import { VenueScheduleForm } from "./VenueScheduleForm";

interface VenueFormProps {
    initialData?: Partial<VenueFormValues>;
    onSubmit: (values: VenueFormValues) => void;
    isPending: boolean;
}

export function VenueForm({
    initialData,
    onSubmit,
    isPending,
}: VenueFormProps) {
    const { user } = useAuth();
    const isRenter = user?.role === "RENTER";

    const { data: usersData } = useGetAllUsersWithoutPagination();
    const renters = usersData?.filter((user) => user.role === "RENTER") || [];
    const renterOptions = renters.map((renter) => ({
        value: renter.id,
        label: renter.fullName,
    }));

    const formatTime = (isoString: string) => {
        try {
            if (!isoString.includes("T")) return isoString;
            const date = new Date(isoString);
            const hours = date.getUTCHours().toString().padStart(2, "0");
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        } catch (e) {
            return isoString;
        }
    };

    const formattedSchedules =
        initialData?.schedules?.map((s) => ({
            ...s,
            openTime: formatTime(s.openTime),
            closeTime: formatTime(s.closeTime),
        })) || [];

    const form = useForm<VenueFormValues>({
        resolver: zodResolver(venueSchema),
        defaultValues: {
            name: initialData?.name || "",
            address: initialData?.address || "",
            renterId: initialData?.renterId || (isRenter && user ? user.id : ""),
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
                />
                <InputField
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Kalibaru Street No. 10, Surabaya"
                />
                {!isRenter && (
                    <SelectField
                        control={form.control}
                        name="renterId"
                        label="Renter (Owner)"
                        placeholder="Select a renter"
                        options={renterOptions}
                        disabled={!!initialData}
                    />
                )}
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
