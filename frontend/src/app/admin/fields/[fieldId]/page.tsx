"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useGetFieldById, useUpdateField } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Separator } from "@/components/ui/separator";
import { FieldForm } from "../../venues/[venueId]/edit/components/FieldForm";
import { PageHeader } from "../../components/PageHeader";
import { FieldFormValues } from "@/lib/schema/field.schema";

export default function EditFieldPage() {
    const params = useParams();
    const fieldId = Array.isArray(params.fieldId)
        ? params.fieldId[0]
        : params.fieldId;

    const searchParams = useSearchParams();
    const fromVenueId = searchParams.get("fromVenue");

    const backHref = fromVenueId
        ? `/admin/venues/${fromVenueId}/edit`
        : "/admin/venues";
    const {
        data: field,
        isLoading,
        isError,
    } = useGetFieldById(fieldId as string);
    const { mutate: updateField, isPending } = useUpdateField(
        fieldId as string
    );

    const handleFormSubmit = (data: FieldFormValues) => {
        updateField(data);
    };

    if (isLoading) return <FullScreenLoader />;
    if (isError || !field)
        return <p className="text-red-500">Error: Field not found.</p>;

    return (
        <div className="space-y-8">
            <PageHeader
                backHref={backHref}
                title={`Edit Field: ${field.name}`}
            />

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">
                        Field Details
                    </h2>
                    <FieldForm
                        initialData={field}
                        onSubmit={handleFormSubmit}
                        isPending={isPending}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Weekly Schedule
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Coming soon...
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Photo Gallery
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
