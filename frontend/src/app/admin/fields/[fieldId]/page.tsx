"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
    useGetFieldById,
    useUpdateField,
    useUploadFieldPhotos,
} from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Separator } from "@/components/ui/separator";
import { FieldForm } from "@/components/shared/fields/FieldForm";
import { PageHeader } from "../../components/PageHeader";
import { Field, FieldFormValues } from "@/lib/schema/field.schema";
import { FieldStatusUpdater } from "./FieldStatusUpdater";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldPhotoGallery } from "./FieldPhotoGallery";
import { ImageUploader } from "@/components/shared/form/ImageUploader";
import { ScheduleDisplay } from "@/components/shared/fields/ScheduleDisplay";

export default function EditFieldPage() {
    const params = useParams();
    const fieldId = Array.isArray(params.fieldId)
        ? params.fieldId[0]
        : params.fieldId;

    const searchParams = useSearchParams();
    const fromVenueId = searchParams.get("fromVenue");

    if (!fieldId) {
        return <FullScreenLoader />;
    }

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
    const { mutateAsync: uploadPhotos, isPending: isUploading } =
        useUploadFieldPhotos(fieldId as string);

    const handleFormSubmit = (data: FieldFormValues) => {
        updateField(data);
    };

    const handleUpload = async (files: File[]) => {
        await uploadPhotos(files);
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
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Field Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldForm
                                key={field.id}
                                initialData={field}
                                onSubmit={handleFormSubmit}
                                isPending={isPending}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Photo Gallery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldPhotoGallery
                                photos={field.photos || []}
                                fieldId={fieldId}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <FieldStatusUpdater field={field as Field} role="ADMIN" />
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Photos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageUploader
                                onUpload={handleUpload}
                                isUploading={isUploading}
                            />
                        </CardContent>
                    </Card>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Weekly Schedule
                        </h2>
                        <Card>
                            <CardContent className="pt-6">
                                <ScheduleDisplay schedules={field.venue.schedules || []} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
