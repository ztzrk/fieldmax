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
}

/**
 * HeroSection Component
 *
 * Displays the main hero banner with search box and sport type filters.
 */
export function HeroSection({ sportTypes, suggestions }: HeroSectionProps) {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim()) {
            router.push(`/search?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-muted/50">
            <div className="w-full px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                        Find Your Perfect{" "}
                        <span className="text-primary">Field</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Browse top-rated sports venues and book instantly.
                    </p>

                    <div className="w-full max-w-sm space-y-2 relative">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by field name..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>

                        {search.length > 0 &&
                            suggestions &&
                            suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95">
                                    <div className="p-1">
                                        {suggestions.map((field) => (
                                            <div
                                                key={field.id}
                                                className="flex items-center gap-2 p-2 rounded-sm hover:bg-muted cursor-pointer transition-colors"
                                                onClick={() =>
                                                    router.push(
                                                        `/search?q=${encodeURIComponent(
                                                            field.name
                                                        )}`
                                                    )
                                                }
                                            >
                                                <div className="h-8 w-8 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                                    {field.photos &&
                                                    field.photos[0] ? (
                                                        <img
                                                            src={
                                                                field.photos[0]
                                                                    .url
                                                            }
                                                            alt={field.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Trophy className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start text-left">
                                                    <span className="text-sm font-medium">
                                                        {field.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {field.venue?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Sport Type Filters */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                            <Link href="/fields">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full"
                                >
                                    All
                                </Button>
                            </Link>
                            {sportTypes?.map((type) => (
                                <Link
                                    key={type.id}
                                    href={`/fields?sport=${type.id}`}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full"
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
