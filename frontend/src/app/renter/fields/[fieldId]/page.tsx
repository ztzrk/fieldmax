"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    useGetFieldById,
    useUpdateField,
    useUploadFieldPhotos,
} from "@/hooks/useFields";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import {
    FieldDetailResponseSchema,
    FieldFormSchema,
} from "@/lib/schema/field.schema";
import { FieldStatusUpdater } from "@/app/admin/fields/[fieldId]/edit/components/FieldStatusUpdater";
import { useAuth } from "@/context/AuthContext";
import { FieldForm } from "@/components/shared/fields/FieldForm";
import { FieldPhotoGallery } from "@/app/admin/fields/[fieldId]/edit/components/FieldPhotoGallery";
import { ImageUploader } from "@/components/shared/form/ImageUploader";
import FieldClosureSwitch from "@/components/shared/fields/FieldClosureSwitch";
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
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    ImageIcon,
    Images,
    Power,
    Trophy,
    Wallet,
} from "lucide-react";

const FIELD_STATUS_BADGE: Record<
    string,
    { label: string; className: string }
> = {
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
 * Renter Field Detail Page.
 * Modern tabbed workspace for managing field details, operational status, and photos.
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
    const { mutate: updateField, isPending } = useUpdateField(fieldId || "");
    const { mutateAsync: uploadPhotos, isPending: isUploading } =
        useUploadFieldPhotos(fieldId || "");

    if (!fieldId || isLoading) {
        return <FullScreenLoader />;
    }

    if (isError || !field) {
        return (
            <p className="text-center text-destructive font-medium py-10">
                Lapangan tidak ditemukan.
            </p>
        );
    }

    const handleFormSubmit = (data: FieldFormSchema) => {
        updateField(data);
    };

    const handleUpload = async (files: File[]) => {
        await uploadPhotos(files);
    };

    const photos = field.photos || [];
    const statusBadge = FIELD_STATUS_BADGE[field.status] ?? {
        label: field.status,
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
                <Link href={backHref}>
                    <ArrowLeft className="h-4 w-4" />
                    {fromVenueId
                        ? "Kembali ke Detail Tempat Olahraga"
                        : "Kembali ke Lapangan Saya"}
                </Link>
            </Button>

            {/* Summary Header Card */}
            <Card className="rounded-2xl border-border/70 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className={statusBadge.className}
                                >
                                    {statusBadge.label}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={
                                        field.isClosed
                                            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                                            : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    }
                                >
                                    {field.isClosed
                                        ? "Tutup Sementara"
                                        : "Aktif / Buka"}
                                </Badge>
                                {field.sportType?.name && (
                                    <Badge variant="secondary">
                                        {field.sportType.name}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                {field.name}
                            </h1>
                            {field.venue?.name && (
                                <p className="text-sm text-muted-foreground">
                                    Bagian dari{" "}
                                    <span className="font-medium text-foreground">
                                        {field.venue.name}
                                    </span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 shrink-0">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tarif Sewa
                                </p>
                                <p className="text-lg font-bold text-primary">
                                    {formatCurrency(field.pricePerHour)}
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {" "}
                                        / jam
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabbed Workspace */}
            <Tabs defaultValue="info" className="space-y-6">
                <TabsList className="bg-card border border-border/70 p-1 h-auto flex-wrap justify-start">
                    <TabsTrigger value="info" className="gap-2 py-2 px-4">
                        <Trophy className="h-4 w-4" />
                        Informasi & Status
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="gap-2 py-2 px-4">
                        <Images className="h-4 w-4" />
                        Galeri Foto ({photos.length})
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Info & Status */}
                <TabsContent value="info">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-primary" />
                                    Detail Lapangan
                                </CardTitle>
                                <CardDescription>
                                    Perbarui nama, harga sewa per jam, cabang
                                    olahraga, dan deskripsi lapangan.
                                </CardDescription>
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

                        <div className="space-y-6">
                            {user?.role === "RENTER" && (
                                <>
                                    <FieldStatusUpdater
                                        field={
                                            field as FieldDetailResponseSchema
                                        }
                                        role="RENTER"
                                    />
                                    <Card className="rounded-2xl border-border/70 shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Power className="h-4 w-4 text-primary" />
                                                Status Operasional
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <FieldClosureSwitch
                                                fieldId={field.id}
                                                initialIsClosed={field.isClosed}
                                            />
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>
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
                                    lapangan.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <FieldPhotoGallery
                                    photos={photos}
                                    fieldId={fieldId}
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
                                    Unggah foto permukaan lapangan, pencahayaan,
                                    atau fasilitas sekitar.
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
            </Tabs>
        </div>
    );
}
