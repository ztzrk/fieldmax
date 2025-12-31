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
            <p className="text-center text-red-500 py-10">
                Error: Venue not found.
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
                description="Update venue details, photos, and fields."
                backHref="/renter/venues"
            >
                <RenterVenueActions venue={venue} />
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Venue Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <VenueForm
                                initialData={venue}
                                onSubmit={handleFormSubmit}
                                isPending={isUpdating}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Photo Gallery</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PhotoGallery
                                photos={venue.photos || []}
                                venueId={venueId}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
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
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Fields in this Venue</CardTitle>
                            <CardDescription>
                                Manage all fields for {venue.name}
                            </CardDescription>
                        </div>
                        {venue.status === "APPROVED" ? (
                            <CreateFieldButton venueId={venueId} />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                This venue must be approved before you can add
                                fields.
                            </p>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
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
