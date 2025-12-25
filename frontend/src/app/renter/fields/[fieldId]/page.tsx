"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
    useGetFieldById,
    useUpdateField,
    useUploadFieldPhotos,
} from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/app/admin/components/PageHeader";
import { Field, FieldFormValues } from "@/lib/schema/field.schema";
import { FieldStatusUpdater } from "@/app/admin/fields/[fieldId]/FieldStatusUpdater";
import { useAuth } from "@/context/AuthContext";
import { FieldForm } from "@/components/shared/fields/FieldForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldPhotoGallery } from "@/app/admin/fields/[fieldId]/FieldPhotoGallery";
import { ImageUploader } from "@/components/shared/form/ImageUploader";
import FieldClosureSwitch from "@/components/shared/fields/FieldClosureSwitch";

export default function EditFieldPage() {
    const params = useParams();
    const fieldId = Array.isArray(params.fieldId)
        ? params.fieldId[0]
        : params.fieldId;

    const searchParams = useSearchParams();
    const fromVenueId = searchParams.get("fromVenue");
    const { user } = useAuth();

    if (!fieldId) {
        return <FullScreenLoader />;
    }

    const backHref = fromVenueId
        ? `/renter/venues/${fromVenueId}`
        : "/renter/fields";
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
                                initialData={{
                                    ...field,
                                    description: field.description ?? "",
                                }}
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
                    {user?.role === "RENTER" && (
                        <div className="space-y-6">
                            <FieldStatusUpdater
                                field={field as Field}
                                role="RENTER"
                            />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Field Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FieldClosureSwitch
                                        fieldId={field.id}
                                        initialIsClosed={field.isClosed}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}
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
                        <p className="text-sm text-muted-foreground">
                            Coming soon...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
