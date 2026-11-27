"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PaginationState } from "@tanstack/react-table";
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
import { CreateFieldButton } from "@/components/shared/fields/CreateFieldButton";
import { RenterVenueActions } from "./components/RenterVenueActions";
import { VenueFormSchema } from "@/lib/schema/venue.schema";
import { DataTable } from "@/components/shared/DataTable";
import { getRenterFieldColumns } from "./components/columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Building2,
    ImageIcon,
    Images,
    MapPin,
    Trophy,
} from "lucide-react";

const VENUE_STATUS_BADGE: Record<
    string,
    { label: string; className: string }
> = {
    DRAFT: {
        label: "Draf",
        className:
            "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
    },
    PENDING: {
        label: "Menunggu Verifikasi",
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
    },
    APPROVED: {
        label: "Disetujui",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    REJECTED: {
        label: "Ditolak",
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
    },
};

/**
 * Renter Venue Detail Page.
 * Modern tabbed workspace for managing venue info, photos, and fields.
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

    const photos = venue.photos || [];
    const totalFields = venue.fields?.length || 0;
    const pageCount = Math.ceil(totalFields / pageSize);
    const paginatedFields = (venue.fields || []).slice(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize
    );
    const statusBadge = VENUE_STATUS_BADGE[venue.status] ?? {
        label: venue.status,
        className: "",
    };

    return (
        <div className="space-y-6">
            {/* Back Link */}
            <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
                <Link href="/renter/venues">
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke Tempat Olahraga Saya
                </Link>
            </Button>

            {/* Summary Header Card */}
            <Card className="rounded-2xl border-border/70 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <Badge
                                    variant="outline"
                                    className={statusBadge.className}
                                >
                                    {statusBadge.label}
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    <Trophy className="h-3 w-3" />
                                    {totalFields} Lapangan
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    <Images className="h-3 w-3" />
                                    {photos.length} Foto
                                </Badge>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {venue.name}
                            </h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                                <span>
                                    {[venue.address, venue.district, venue.city]
                                        .filter(Boolean)
                                        .join(", ")}
                                </span>
                            </p>
                        </div>
                        <div className="shrink-0">
                            <RenterVenueActions venue={venue} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabbed Workspace */}
            <Tabs defaultValue="info" className="space-y-6">
                <TabsList className="bg-card border border-border/70 p-1 h-auto flex-wrap justify-start">
                    <TabsTrigger value="info" className="gap-2 py-2 px-4">
                        <Building2 className="h-4 w-4" />
                        Informasi & Jadwal
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="gap-2 py-2 px-4">
                        <Images className="h-4 w-4" />
                        Galeri Foto ({photos.length})
                    </TabsTrigger>
                    <TabsTrigger value="fields" className="gap-2 py-2 px-4">
                        <Trophy className="h-4 w-4" />
                        Daftar Lapangan ({totalFields})
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Info & Schedule */}
                <TabsContent value="info">
                    <Card className="rounded-2xl border-border/70 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <CardTitle className="text-lg">
                                Detail Tempat Olahraga & Jam Operasional
                            </CardTitle>
                            <CardDescription>
                                Pastikan alamat dan jadwal buka-tutup selalu
                                akurat agar pelanggan mudah memesan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <VenueForm
                                initialData={venue}
                                onSubmit={handleFormSubmit}
                                isPending={isUpdating}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Photos */}
                <TabsContent value="photos">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Images className="h-4 w-4 text-primary" />
                                    Galeri Foto ({photos.length})
                                </CardTitle>
                                <CardDescription>
                                    Klik foto untuk memperbesar atau hapus foto
                                    yang tidak diperlukan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <PhotoGallery
                                    photos={photos}
                                    venueId={venueId}
                                />
                            </CardContent>
                        </Card>

                        <Card className="h-fit rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    Tambah Foto Baru
                                </CardTitle>
                                <CardDescription>
                                    Unggah foto fasilitas, area parkir, atau
                                    suasana tempat olahraga.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ImageUploader
                                    onUpload={handleUpload}
                                    isUploading={isUploading}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab 3: Fields */}
                <TabsContent value="fields">
                    <Card className="rounded-2xl border-border/70 shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/50">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-primary" />
                                        Daftar Lapangan di {venue.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Kelola unit lapangan, tarif per jam, dan
                                        status ketersediaannya.
                                    </CardDescription>
                                </div>
                                {venue.status === "APPROVED" ? (
                                    <CreateFieldButton venueId={venueId} />
                                ) : (
                                    <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg px-3 py-2">
                                        Tempat olahraga harus disetujui admin
                                        terlebih dahulu sebelum menambahkan
                                        lapangan.
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
                </TabsContent>
            </Tabs>
        </div>
    );
}
