"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
    useGetFieldById,
    useUpdateField,
    useUploadFieldPhotos,
} from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { PageHeader } from "@/app/admin/components/PageHeader";
import {
    FieldDetailResponseSchema,
    FieldFormSchema,
} from "@/lib/schema/field.schema";
import { FieldStatusUpdater } from "@/app/admin/fields/[fieldId]/edit/components/FieldStatusUpdater";
import { useAuth } from "@/context/AuthContext";
import { FieldForm } from "@/components/shared/fields/FieldForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldPhotoGallery } from "@/app/admin/fields/[fieldId]/edit/components/FieldPhotoGallery";
import { ImageUploader } from "@/components/shared/form/ImageUploader";
import FieldClosureSwitch from "@/components/shared/fields/FieldClosureSwitch";
import { ImageIcon, Images, Power, Trophy } from "lucide-react";

/**
 * Renter Field Detail Page.
 * Allows editing of field details, managing photos, and toggling closure status.
 */
export default function EditFieldPage() {
    const params = useParams();
    const fieldId = Array.isArray(params.fieldId)
        ? params.fieldId[0]
        : params.fieldId;

    const searchParams = useSearchParams();
    const fromVenueId = searchParams.get("fromVenue");
    const { user } = useAuth();

    const backHref = fromVenueId
        ? `/renter/venues/${fromVenueId}`
        : "/renter/fields";

    const {
        data: field,
        isLoading,
        isError,
    } = useGetFieldById(fieldId || "");
    const { mutate: updateField, isPending } = useUpdateField(
        fieldId || ""
    );
    const { mutateAsync: uploadPhotos, isPending: isUploading } =
        useUploadFieldPhotos(fieldId || "");

    if (!fieldId) {
        return <FullScreenLoader />;
    }

    const handleFormSubmit = (data: FieldFormSchema) => {
        updateField(data);
    };

    const handleUpload = async (files: File[]) => {
        await uploadPhotos(files);
    };

    if (isLoading) return <FullScreenLoader />;
    if (isError || !field)
        return (
            <p className="text-center text-destructive font-medium py-10">
                Lapangan tidak ditemukan.
            </p>
        );

    return (
        <div className="space-y-8">
            <PageHeader
                backHref={backHref}
                title={`Edit Lapangan: ${field.name}`}
                description="Perbarui informasi lapangan, harga sewa, status operasional, dan galeri foto."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-primary" />
                                Detail Lapangan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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

                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Images className="h-4 w-4 text-primary" />
                                Galeri Foto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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
                                field={field as FieldDetailResponseSchema}
                                role="RENTER"
                            />
                            <Card className="rounded-xl border-border/60 shadow-sm">
                                <CardHeader className="pb-4 border-b border-border/50">
                                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                        <Power className="h-4 w-4 text-primary" />
                                        Status Operasional
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <FieldClosureSwitch
                                        fieldId={field.id}
                                        initialIsClosed={field.isClosed}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <ImageIcon className="h-4 w-4 text-primary" />
                                Tambah Foto Baru
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ImageUploader
                                onUpload={handleUpload}
                                isUploading={isUploading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
