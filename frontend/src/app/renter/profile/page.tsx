"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useGetProfile,
    useUpdateProfile,
    useUploadCompanyLogo,
    useUploadProfilePicture,
} from "@/hooks/useProfile";
import {
    ProfileFormSchema,
    profileFormSchema,
} from "@/lib/schema/profile.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { TextareaField } from "@/components/shared/form/TextareaField";
import {
    Building2,
    Camera,
    ExternalLink,
    Loader2,
    Save,
    ShieldCheck,
    User as UserIcon,
} from "lucide-react";

export default function RenterProfilePage() {
    const { data: user, isLoading, isError } = useGetProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: uploadLogo, isPending: isUploadingLogo } =
        useUploadCompanyLogo();
    const { mutate: uploadPhoto, isPending: isUploadingPhoto } =
        useUploadProfilePicture();

    const logoInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            bio: "",
            address: "",
            companyName: "",
            companyDescription: "",
            companyWebsite: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                address: user.profile?.address || "",
                companyName: user.profile?.companyName || "",
                companyDescription: user.profile?.companyDescription || "",
                companyWebsite: user.profile?.companyWebsite || "",
            });
        }
    }, [user, form]);

    const onSubmit = (values: ProfileFormSchema) => {
        updateProfile({
            fullName: values.fullName?.trim() || undefined,
            phoneNumber: values.phoneNumber?.trim() || undefined,
            bio: values.bio?.trim() || undefined,
            address: values.address?.trim() || undefined,
            companyName: values.companyName?.trim() || null,
            companyDescription: values.companyDescription?.trim() || null,
            companyWebsite: values.companyWebsite?.trim() || null,
        });
    };

    if (isLoading) return <FullScreenLoader />;

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-muted-foreground">
                    Gagal memuat profil mitra.
                </p>
            </div>
        );
    }

    const displayName = user.profile?.companyName || user.fullName;
    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("");

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Profil Mitra
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        Kelola identitas bisnis dan informasi penanggung jawab
                        yang tampil di halaman publik.
                    </p>
                </div>
                <Button variant="outline" asChild className="gap-2">
                    <Link href={`/renters/${user.id}`}>
                        <ExternalLink className="h-4 w-4" />
                        Lihat Halaman Publik
                    </Link>
                </Button>
            </div>

            {/* Brand & Account Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/70">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            Logo Mitra / Perusahaan
                        </CardTitle>
                        <CardDescription>
                            Ditampilkan di katalog mitra & halaman publik Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-20 w-20 border-2 border-border">
                                <AvatarImage
                                    src={
                                        user.profile?.companyLogoUrl ||
                                        undefined
                                    }
                                    alt={displayName}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                    {initials || "M"}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) uploadLogo(file);
                                    e.target.value = "";
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                disabled={isUploadingLogo}
                                onClick={() => logoInputRef.current?.click()}
                            >
                                {isUploadingLogo ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                                {isUploadingLogo
                                    ? "Mengunggah..."
                                    : "Ubah Logo Mitra"}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Format JPEG, PNG, atau WebP (maks. 5 MB).
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/70">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-primary" />
                            Foto Penanggung Jawab
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <span>{user.email}</span>
                            <Badge variant="secondary" className="gap-1">
                                <ShieldCheck className="h-3 w-3" />
                                Mitra
                            </Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-20 w-20 border-2 border-border">
                                <AvatarImage
                                    src={
                                        user.profile?.profilePictureUrl ||
                                        undefined
                                    }
                                    alt={user.fullName}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-lg font-bold bg-muted">
                                    {user.fullName
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) uploadPhoto(file);
                                    e.target.value = "";
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                disabled={isUploadingPhoto}
                                onClick={() => photoInputRef.current?.click()}
                            >
                                {isUploadingPhoto ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                                {isUploadingPhoto
                                    ? "Mengunggah..."
                                    : "Ubah Foto Profil"}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Digunakan untuk foto akun pribadi Anda.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Edit Form */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <Card className="border-border/70">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Informasi Bisnis / Mitra
                            </CardTitle>
                            <CardDescription>
                                Informasi ini akan dilihat oleh calon penyewa di
                                halaman publik Mitra FieldMax.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    control={form.control}
                                    name="companyName"
                                    label="Nama Usaha / Mitra"
                                    placeholder="Contoh: Arena Sport Nusantara"
                                />
                                <InputField
                                    control={form.control}
                                    name="companyWebsite"
                                    label="Website (Opsional)"
                                    placeholder="https://contohmitra.com"
                                />
                            </div>
                            <InputField
                                control={form.control}
                                name="address"
                                label="Alamat Kantor / Pusat"
                                placeholder="Alamat lengkap usaha Anda"
                            />
                            <TextareaField
                                control={form.control}
                                name="companyDescription"
                                label="Deskripsi Mitra"
                                placeholder="Ceritakan tentang fasilitas, pengalaman, atau keunggulan tempat olahraga yang Anda kelola..."
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/70">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Informasi Penanggung Jawab
                            </CardTitle>
                            <CardDescription>
                                Data kontak pemilik atau pengelola akun mitra.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    control={form.control}
                                    name="fullName"
                                    label="Nama Lengkap"
                                    placeholder="Nama penanggung jawab"
                                />
                                <InputField
                                    control={form.control}
                                    name="phoneNumber"
                                    label="Nomor Telepon / WhatsApp"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                            <TextareaField
                                control={form.control}
                                name="bio"
                                label="Bio Singkat"
                                placeholder="Catatan atau bio singkat pengelola..."
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isUpdating}
                            className="gap-2"
                        >
                            {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
