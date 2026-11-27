"use client";

import {
    useGetVenueById,
    useUpdateVenue,
    useUploadVenuePhotos,
} from "@/hooks/useVenues";
import { useDeleteMultipleFields } from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { VenueForm } from "../../components/VenueForm";
import { ImageUploader } from "@/components/shared/form/ImageUploader";
import { PhotoGallery } from "./components/PhotoGallery";
import { useParams } from "next/navigation";
import { CreateFieldButton } from "@/components/shared/fields/CreateFieldButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { VenueActions } from "./components/VenueActions";
import { PageHeader } from "@/app/admin/components/PageHeader";
import { VenueFormSchema } from "@/lib/schema/venue.schema";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/columns";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/**
 * Admin Venue Edit Page.
 * Allows admins to view details, update fields, and approve/reject venues.
 */
export default function EditVenuePage() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [fieldSearch, setFieldSearch] = useState("");
    const [fieldStatus, setFieldStatus] = useState<string>("ALL");

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
            <p className="text-center text-destructive py-10">
                Gagal memuat: Tempat olahraga tidak ditemukan.
            </p>
        );

    const handleFormSubmit = (values: VenueFormSchema) => {
        updateVenue(values);
    };

    const handleUpload = async (files: File[]) => {
        await uploadPhotos(Array.from(files));
    };

    const filteredFields = (venue.fields || []).filter((field) => {
        const matchesSearch =
            !fieldSearch ||
            field.name.toLowerCase().includes(fieldSearch.toLowerCase()) ||
            (field.sportTypeName || "")
                .toLowerCase()
                .includes(fieldSearch.toLowerCase());
        const matchesStatus =
            fieldStatus === "ALL" || field.status === fieldStatus;
        return matchesSearch && matchesStatus;
    });
    const pageCount = Math.ceil(filteredFields.length / pageSize);
    const paginatedFields = filteredFields.slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title={venue.name}
                description="Perbarui detail tempat olahraga, foto, dan daftar lapangan."
            >
                <VenueActions venue={venue} />
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Tempat Olahraga</CardTitle>
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
                            <CardTitle>Galeri Foto</CardTitle>
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
                            <CardTitle>Tambah Foto Baru</CardTitle>
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Daftar Lapangan di Tempat Ini</CardTitle>
                            <CardDescription>
                                Kelola seluruh lapangan untuk {venue.name}
                            </CardDescription>
                        </div>
                        {venue.status === "APPROVED" ? (
                            <CreateFieldButton venueId={venueId} />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Tempat olahraga harus disetujui terlebih dahulu
                                sebelum menambahkan lapangan.
                            </p>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={paginatedFields}
                        onDeleteSelected={handleDeleteSelected}
                        pageCount={pageCount}
                        pagination={{ pageIndex, pageSize }}
                        onPaginationChange={setPagination}
                        onSearch={(val) => {
                            setFieldSearch(val);
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                        searchValue={fieldSearch}
                        searchPlaceholder="Cari nama atau cabang olahraga..."
                        hasActiveFilters={fieldStatus !== "ALL"}
                        onResetFilters={() => {
                            setFieldSearch("");
                            setFieldStatus("ALL");
                            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                        }}
                        filters={
                            <Select
                                value={fieldStatus}
                                onValueChange={(val) => {
                                    setFieldStatus(val);
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex: 0,
                                    }));
                                }}
                            >
                                <SelectTrigger className="h-9 w-[180px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="PENDING">
                                        Menunggu Verifikasi
                                    </SelectItem>
                                    <SelectItem value="APPROVED">
                                        Disetujui
                                    </SelectItem>
                                    <SelectItem value="REJECTED">
                                        Ditolak
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        }
                    />
                </CardContent>
            </Card>
        </div>
    );
}
