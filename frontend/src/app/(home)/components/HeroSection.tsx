"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trophy } from "lucide-react";
import { FieldResponseSchema } from "@/lib/schema/field.schema";

interface HeroSectionProps {
    sportTypes?: { id: string; name: string }[];
    suggestions?: FieldResponseSchema[];
    searchValue: string;
    onSearchChange: (value: string) => void;
    isSearching: boolean;
}

/**
 * HeroSection Component
 *
 * Displays the main hero banner with search box and sport type filters.
 */
export function HeroSection({
    sportTypes,
    suggestions,
    searchValue,
    onSearchChange,
    isSearching,
}: HeroSectionProps) {
    const router = useRouter();

    const triggerSearch = () => {
        if (searchValue.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
        } else {
            router.push("/fields");
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchValue.trim()) {
            triggerSearch();
        }
    };

    return (
        <section className="relative w-full py-12 md:py-16 lg:py-20 border-b border-border/40">
            {/* Background */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-primary/85 to-amber-600/90" />
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute -top-24 right-0 w-[420px] h-[420px] bg-white/15 rounded-full blur-[110px] pointer-events-none" />
                <div className="absolute -bottom-24 left-0 w-[420px] h-[420px] bg-black/25 rounded-full blur-[110px] pointer-events-none" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center space-y-6 text-center animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <div className="space-y-3 max-w-3xl">
                        <h1 className="text-3xl font-black tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-sm">
                            Temukan &amp; Pesan{" "}
                            <span className="text-amber-200">
                                Lapangan
                            </span>{" "}
                            Favoritmu
                        </h1>
                        <p className="mx-auto max-w-[640px] text-white/90 text-base md:text-lg leading-relaxed">
                            Cari tempat olahraga terbaik, cek ketersediaan jadwal
                            secara langsung, dan sewa lapangan dalam hitungan
                            detik.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl space-y-4 relative z-30">
                        <div className="relative z-30">
                            <div className="relative flex items-center rounded-2xl bg-background/95 p-1.5 shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
                                <Search className="ml-3.5 h-5 w-5 text-muted-foreground shrink-0" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama lapangan, tempat olahraga, atau cabang olahraga..."
                                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-11 text-base px-3"
                                    value={searchValue}
                                    onChange={(e) =>
                                        onSearchChange(e.target.value)
                                    }
                                    onKeyDown={handleSearch}
                                />
                                <Button
                                    type="button"
                                    onClick={triggerSearch}
                                    className="h-10 px-6 rounded-xl font-semibold shrink-0"
                                >
                                    Cari
                                </Button>
                            </div>
                            {searchValue.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-background/95 backdrop-blur-md text-foreground rounded-xl border shadow-2xl animate-in fade-in-0 zoom-in-95 overflow-hidden ring-1 ring-black/5">
                                    {isSearching ? (
                                        <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            <span>Mencari...</span>
                                        </div>
                                    ) : suggestions &&
                                      suggestions.length > 0 ? (
                                        <div className="p-2 space-y-1">
                                            {suggestions.map((field) => (
                                                <div
                                                    key={field.id}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors group"
                                                    onClick={() =>
                                                        router.push(
                                                            `/search?q=${encodeURIComponent(
                                                                field.name
                                                            )}`
                                                        )
                                                    }
                                                >
                                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-sm border group-hover:border-primary/50 transition-colors">
                                                        {field.photos &&
                                                        field.photos[0] ? (
                                                            <Image
                                                                src={
                                                                    field
                                                                        .photos[0]
                                                                        .url
                                                                }
                                                                alt={field.name}
                                                                width={48}
                                                                height={48}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Trophy className="h-5 w-5 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-start text-left">
                                                        <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                                                            {field.name}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {field.venue?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors group border-t mt-1"
                                                onClick={() =>
                                                    router.push(
                                                        `/search?q=${encodeURIComponent(
                                                            searchValue
                                                        )}`
                                                    )
                                                }
                                            >
                                                <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                                    <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className="flex flex-col items-start text-left">
                                                    <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                                                        Lihat semua hasil untuk "
                                                        {searchValue}"
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <p>
                                                Tidak ditemukan hasil untuk "
                                                {searchValue}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Sport Type Filters */}
                        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 pt-1">
                            <Link href="/fields">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full px-4 h-8 text-xs font-semibold shadow-sm"
                                >
                                    Semua Olahraga
                                </Button>
                            </Link>
                            {sportTypes?.slice(0, 6).map((type) => (
                                <Link
                                    key={type.id}
                                    href={`/fields?sport=${type.id}`}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full px-4 h-8 text-xs font-medium text-white bg-white/15 hover:bg-white/25 hover:text-white border border-white/20 backdrop-blur-sm transition-all"
                                    >
                                        {type.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
