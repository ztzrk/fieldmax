"use client";

import { useState } from "react";
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

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchValue.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchValue)}`);
        }
    };

    return (
        <section className="relative w-full py-20 md:py-32 lg:py-48">
            {/* Background enhancement */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-600 to-amber-600 opacity-95" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-4 max-w-3xl">
                        <div className="inline-block px-4 py-1.5 mb-2 text-sm font-semibold tracking-wide text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                            ✨ #1 Sports Booking Platform
                        </div>
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-sm">
                            Find Your Perfect{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                                Field
                            </span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-blue-50 md:text-xl lg:text-2xl leading-relaxed font-medium">
                            Discover top-rated venues, check real-time
                            availability, and book your next game in seconds.
                        </p>
                    </div>

                    <div className="w-full max-w-lg space-y-2 relative">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground z-10" />
                            <Input
                                type="search"
                                placeholder="Search fields, venues, or sports..."
                                className="pl-12 h-12 text-lg shadow-lg border-primary/20 hover:border-primary/50 transition-colors bg-background/80 backdrop-blur-sm"
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                            {searchValue.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-background/95 backdrop-blur-md text-foreground rounded-xl border shadow-2xl animate-in fade-in-0 zoom-in-95 overflow-hidden ring-1 ring-black/5">
                                    {isSearching ? (
                                        <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            <span>Searching...</span>
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
                                                            <img
                                                                src={
                                                                    field
                                                                        .photos[0]
                                                                        .url
                                                                }
                                                                alt={field.name}
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
                                                        See all results for "
                                                        {searchValue}"
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <p>
                                                No results found for "
                                                {searchValue}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Sport Type Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                            <Link href="/fields">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="rounded-full px-4 hover:shadow-md transition-shadow font-medium"
                                >
                                    All Sports
                                </Button>
                            </Link>
                            {sportTypes?.slice(0, 5).map((type) => (
                                <Link
                                    key={type.id}
                                    href={`/fields?sport=${type.id}`}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full px-4 border-muted-foreground/20 hover:border-primary/50 hover:text-primary transition-all bg-background/50 backdrop-blur-sm"
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
