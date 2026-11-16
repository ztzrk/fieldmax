"use client";

import {
    useGetVenueById,
    useUpdateVenue,
    useUploadVenuePhotos,
} from "@/hooks/useVenues";
import { useDeleteMultipleFields } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { VenueForm } from "@/app/admin/venues/components/VenueForm";
import { ImageUploader } from "@/components/shared/form/ImageUploader";
import { PhotoGallery } from "@/app/admin/venues/[venueId]/edit/components/PhotoGallery";
import { useParams } from "next/navigation";
import { CreateFieldButton } from "@/components/shared/fields/CreateFieldButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RenterVenueActions } from "./components/RenterVenueActions";
import { PageHeader } from "@/app/admin/components/PageHeader";
import { VenueFormSchema } from "@/lib/schema/venue.schema";
import { DataTable } from "@/components/shared/DataTable";
import { getRenterFieldColumns } from "./components/columns";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { Building2, ImageIcon, Images, Trophy } from "lucide-react";

/**
 * Renter Venue Detail Page.
 * Allows editing of venue details, managing photos, and viewing/managing its fields.
 */
export default function EditVenuePage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const params = useParams();
    const venueId = Array.isArray(params.venueId)
        ? params.venueId[0]
        : params.venueId || "";

    const {
        data: venue,
        isLoading,
        isError,
    } = useGetVenueById(venueId as string);
    const { mutate: updateVenue, isPending: isUpdating } = useUpdateVenue(
        venueId as string
    );

    const { mutateAsync: uploadPhotos, isPending: isUploading } =
        useUploadVenuePhotos(venueId as string);

    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleFields();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError || !venue)
        return (
            <p className="text-center text-destructive font-medium py-10">
                Tempat olahraga tidak ditemukan.
            </p>
        );

    const handleFormSubmit = (values: VenueFormSchema) => {
        updateVenue(values);
    };

    const handleUpload = async (files: File[]) => {
        await uploadPhotos(Array.from(files));
    };

    const totalFields = venue.fields?.length || 0;
    const pageCount = Math.ceil(totalFields / pageSize);
    const paginatedFields = (venue.fields || []).slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title={venue.name}
                description="Perbarui detail tempat olahraga, galeri foto, dan daftar lapangan."
                backHref="/renter/venues"
            >
                <RenterVenueActions venue={venue} />
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-xl border-border/60 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" />
                                Detail Tempat Olahraga
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <VenueForm
                                initialData={venue}
                                onSubmit={handleFormSubmit}
                                isPending={isUpdating}
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
                            <PhotoGallery
                                photos={venue.photos || []}
                                venueId={venueId}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
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

            <Card className="rounded-xl border-border/60 shadow-sm">
                <CardHeader className="pb-4 border-b border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-primary" />
                                Lapangan di Tempat Ini
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Kelola semua unit lapangan untuk {venue.name}
                            </CardDescription>
                        </div>
                        {venue.status === "APPROVED" ? (
                            <CreateFieldButton venueId={venueId} />
                        ) : (
                            <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg px-3 py-2">
                                Tempat olahraga harus disetujui admin terlebih
                                dahulu sebelum Anda dapat menambahkan lapangan.
                            </p>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <DataTable
                        columns={getRenterFieldColumns(venueId)}
                        data={paginatedFields}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
