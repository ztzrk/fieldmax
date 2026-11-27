"use client";

import {
    useGetProfile,
    useUploadProfilePicture,
    useUpdateProfile,
} from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    MapPin,
    User as UserIcon,
    Phone,
    Camera,
    Pencil,
    Mail,
    Calendar,
    ShieldCheck,
    Ticket,
    Trophy,
    MessageSquareWarning,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ProfileFormSchema,
    profileFormSchema,
} from "@/lib/schema/profile.schema";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { TextareaField } from "@/components/shared/form/TextareaField";

const ROLE_LABELS: Record<string, string> = {
    USER: "Pengguna",
    RENTER: "Mitra",
    ADMIN: "Admin",
};

export default function ProfilePage() {
    const { data: user, isLoading, isError } = useGetProfile();
    const { mutate: uploadPhoto, isPending: isUploading } =
        useUploadProfilePicture();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            bio: "",
            address: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                address: user.profile?.address || "",
            });
        }
    }, [user, form]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadPhoto(file);
        }
    };

    const handleOpenEdit = () => {
        if (user) {
            form.reset({
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                address: user.profile?.address || "",
            });
        }
        setIsEditOpen(true);
    };

    const onSubmit = (data: ProfileFormSchema) => {
        updateProfile(data, {
            onSuccess: () => {
                setIsEditOpen(false);
            },
        });
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">
                    Gagal memuat profil. Pastikan Anda sudah masuk.
                </p>
                <Button asChild>
                    <Link href="/login">Ke Halaman Login</Link>
                </Button>
            </div>
        );
    }

    const initials = user.fullName
        ? user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
        : user.email.substring(0, 2).toUpperCase();

    return (
        <div className="min-h-screen bg-background pb-16">
            {/* Modern Gradient Cover */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-primary/85 to-amber-600/90" />
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute -top-20 right-10 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />

                <div className="container relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>

            <div className="container max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 space-y-6">
                {/* Floating Identity Card */}
                <Card className="rounded-2xl border-border/60 shadow-xl bg-card/95 backdrop-blur-md py-0 overflow-hidden">
                    <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                            <div className="relative group shrink-0">
                                <div
                                    className="relative cursor-pointer rounded-full p-1 bg-background shadow-lg ring-2 ring-primary/20"
                                    onClick={handleAvatarClick}
                                    title="Ubah foto profil"
                                >
                                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28">
                                        {user.profile?.profilePictureUrl && (
                                            <AvatarImage
                                                src={
                                                    user.profile
                                                        .profilePictureUrl
                                                }
                                                alt={user.fullName}
                                                className="object-cover"
                                            />
                                        )}
                                        <AvatarFallback className="text-2xl sm:text-3xl bg-primary text-primary-foreground font-bold">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="absolute bottom-0.5 right-0.5 bg-primary text-primary-foreground p-2 rounded-full shadow-md hover:bg-primary/90 transition-colors border-2 border-background">
                                        {isUploading ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            <Camera className="h-4 w-4" />
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    {user.fullName}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                                    <Badge
                                        variant="secondary"
                                        className="rounded-full gap-1 px-2.5 py-0.5 font-medium"
                                    >
                                        <UserIcon className="h-3 w-3" />
                                        {ROLE_LABELS[user.role] || user.role}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Akun Aktif
                                    </Badge>
                                    <span className="text-muted-foreground text-sm">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center sm:justify-end shrink-0">
                            <Button
                                type="button"
                                onClick={handleOpenEdit}
                                variant="outline"
                                className="rounded-xl gap-2"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit Profil
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Modern Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: About + Quick Links */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="rounded-2xl border-border/60 shadow-sm py-0 overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-semibold">
                                    Tentang Saya
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {user.profile?.bio ? (
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {user.profile.bio}
                                    </p>
                                ) : (
                                    <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                                        Belum ada bio. Klik{" "}
                                        <button
                                            type="button"
                                            onClick={handleOpenEdit}
                                            className="font-semibold text-primary hover:underline"
                                        >
                                            Edit Profil
                                        </button>{" "}
                                        untuk menambahkan deskripsi singkat
                                        Anda.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Access Hub */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link href="/bookings" className="group">
                                <Card className="rounded-2xl border-border/60 hover:border-primary/40 transition-all hover:shadow-md py-0 h-full">
                                    <CardContent className="p-4 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <Ticket className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                    Pemesanan Saya
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Tiket &amp; jadwal
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/fields" className="group">
                                <Card className="rounded-2xl border-border/60 hover:border-primary/40 transition-all hover:shadow-md py-0 h-full">
                                    <CardContent className="p-4 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                                                <Trophy className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                    Cari Lapangan
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Booking cepat
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/reports" className="group">
                                <Card className="rounded-2xl border-border/60 hover:border-primary/40 transition-all hover:shadow-md py-0 h-full">
                                    <CardContent className="p-4 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                                                <MessageSquareWarning className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                    Pusat Bantuan
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    Buat pengaduan
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Contact & Account Info */}
                    <div className="space-y-6">
                        <Card className="rounded-2xl border-border/60 shadow-sm py-0 overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-semibold">
                                    Informasi Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Email
                                        </p>
                                        <p className="text-sm font-medium truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Nomor Telepon
                                        </p>
                                        <p className="text-sm font-medium">
                                            {user.phoneNumber || "Belum diisi"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Alamat
                                        </p>
                                        <p className="text-sm font-medium">
                                            {user.profile?.address ||
                                                "Belum diisi"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-border/60 shadow-sm py-0 overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border/50 py-4 px-6">
                                <CardTitle className="text-base font-semibold">
                                    Detail Akun
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Anggota Sejak
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        Verifikasi
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    >
                                        Terverifikasi
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dedicated Edit Profile Modal (Best Practice) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Profil</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi profil dan kontak Anda di bawah
                            ini.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <InputField
                                control={form.control}
                                name="fullName"
                                label="Nama Lengkap"
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                            <InputField
                                control={form.control}
                                name="phoneNumber"
                                label="Nomor Telepon"
                                placeholder="+62 812 3456 7890"
                            />
                            <InputField
                                control={form.control}
                                name="address"
                                label="Alamat"
                                placeholder="Jl. Contoh No. 123, Kota"
                            />
                            <TextareaField
                                control={form.control}
                                name="bio"
                                label="Tentang Saya"
                                placeholder="Ceritakan sedikit tentang diri Anda atau olahraga favorit..."
                                className="min-h-[110px] resize-none"
                            />

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditOpen(false)}
                                    disabled={isUpdating}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
