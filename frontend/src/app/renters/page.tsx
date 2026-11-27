"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetPublicRenters } from "@/hooks/useGetPublicRenter";
import { useDebounce } from "@/hooks/useDebounce";
import { PublicRenterItem } from "@/services/renter.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    ArrowUpRight,
    Building2,
    ChevronLeft,
    ChevronRight,
    Globe,
    Search,
    Users,
} from "lucide-react";

export default function PublicRentersPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [page, setPage] = useState(1);
    const limit = 12;

    const { data, isLoading } = useGetPublicRenters(
        page,
        limit,
        debouncedSearch.trim() || undefined
    );

    const renters: PublicRenterItem[] = data?.data || [];
    const totalPages: number = data?.meta?.totalPages || 1;
    const total: number = data?.meta?.total || 0;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-950 to-orange-600/20" />
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
                <div className="absolute -top-24 right-10 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

                <div className="container relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-16">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="space-y-3 max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                                Mitra Pengelola FieldMax
                            </h1>
                            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                                Jelajahi pengelola tempat olahraga tepercaya dan
                                temukan venue favorit Anda di berbagai kota.
                            </p>
                        </div>

                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                aria-label="Cari nama mitra"
                                placeholder="Cari nama mitra..."
                                className="pl-10 h-11 bg-white/10 border-white/15 text-white placeholder:text-slate-400 focus-visible:ring-primary"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container max-w-[1400px] mx-auto px-4 md:px-6 pt-10 space-y-6">
                {!isLoading && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan{" "}
                            <span className="font-semibold text-foreground">
                                {renters.length}
                            </span>{" "}
                            dari{" "}
                            <span className="font-semibold text-foreground">
                                {total}
                            </span>{" "}
                            mitra
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card
                                key={i}
                                className="animate-pulse border-border/60 rounded-2xl overflow-hidden"
                            >
                                <div className="h-2 bg-muted" />
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-muted" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-2/3 rounded bg-muted" />
                                            <div className="h-3 w-1/3 rounded bg-muted" />
                                        </div>
                                    </div>
                                    <div className="h-10 w-full rounded bg-muted" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : renters.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
                        <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Users className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">
                            Mitra tidak ditemukan
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Coba gunakan kata kunci pencarian lain.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renters.map((renter) => {
                            const profile = renter.profile;
                            const displayName =
                                profile?.companyName || renter.fullName;
                            const logo =
                                profile?.companyLogoUrl ||
                                profile?.profilePictureUrl ||
                                undefined;
                            const venueCount = renter._count?.venues ?? 0;

                            return (
                                <Link
                                    key={renter.id}
                                    href={`/renters/${renter.id}`}
                                    className="group block h-full"
                                >
                                    <Card className="h-full rounded-2xl border-border/70 bg-card/80 overflow-hidden hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                        <div className="h-1.5 w-full bg-gradient-to-r from-primary/80 via-orange-500/70 to-amber-500/70 opacity-75 group-hover:opacity-100 transition-opacity" />
                                        <CardContent className="p-6 flex flex-col justify-between h-[calc(100%-6px)] gap-5">
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <Avatar className="h-14 w-14 rounded-2xl border border-border/80 shadow-sm shrink-0">
                                                            <AvatarImage
                                                                src={logo}
                                                                alt={
                                                                    displayName
                                                                }
                                                                className="object-cover"
                                                            />
                                                            <AvatarFallback className="rounded-2xl bg-primary/10 text-primary font-bold text-lg">
                                                                {displayName
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                                                {displayName}
                                                            </h3>
                                                            <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-muted-foreground">
                                                                <Building2 className="h-3.5 w-3.5 text-primary/80" />
                                                                <span>
                                                                    {venueCount}{" "}
                                                                    Tempat
                                                                    Olahraga
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="h-8 w-8 rounded-full bg-muted/60 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors shrink-0">
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {profile?.companyDescription ||
                                                        "Mitra penyedia fasilitas olahraga di FieldMax."}
                                                </p>
                                            </div>

                                            <div className="pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="font-medium text-primary group-hover:underline">
                                                    Lihat Venue
                                                </span>
                                                {profile?.companyWebsite && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <Globe className="h-3.5 w-3.5" />
                                                        Website tersedia
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Sebelumnya
                        </Button>
                        <span className="text-sm text-muted-foreground px-3">
                            Halaman {page} dari {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Berikutnya
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
