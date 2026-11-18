"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { FieldCard } from "@/components/fields/FieldCard";
import { FieldCardSkeleton } from "@/components/fields/FieldCardSkeleton";
import { useGetPublicFields } from "@/hooks/useFields";
import { SportType } from "@/lib/schema/sportType.schema";
import { FieldResponseSchema } from "@fieldmax/shared";

interface ExploreFieldsSectionProps {
    sportTypes?: SportType[];
}

export function ExploreFieldsSection({
    sportTypes = [],
}: ExploreFieldsSectionProps) {
    const [selectedSportType, setSelectedSportType] = useState<
        string | undefined
    >(undefined);
    const [sortOrder, setSortOrder] = useState<"desc" | "asc" | undefined>(
        undefined
    );

    const { data: fieldsData, isLoading } = useGetPublicFields(
        1,
        15,
        undefined,
        false,
        selectedSportType,
        sortOrder ? "pricePerHour" : undefined,
        sortOrder
    );

    const fields = (fieldsData?.data || []) as FieldResponseSchema[];

    return (
        <section className="w-full py-10 bg-background border-t border-border/40">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 space-y-6">
                {/* Marketplace Header + Sort Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Flame className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                Jelajahi Lapangan Pilihan
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Pilih cabang olahraga dan langsung pesan jadwal
                                bermain Anda.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mr-1">
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Urutkan:
                        </span>
                        <Button
                            size="sm"
                            variant={
                                sortOrder === undefined ? "default" : "outline"
                            }
                            className="h-8 rounded-full text-xs"
                            onClick={() => setSortOrder(undefined)}
                        >
                            Rekomendasi
                        </Button>
                        <Button
                            size="sm"
                            variant={sortOrder === "asc" ? "default" : "outline"}
                            className="h-8 rounded-full text-xs"
                            onClick={() => setSortOrder("asc")}
                        >
                            Harga Termurah
                        </Button>
                        <Button
                            size="sm"
                            variant={
                                sortOrder === "desc" ? "default" : "outline"
                            }
                            className="h-8 rounded-full text-xs"
                            onClick={() => setSortOrder("desc")}
                        >
                            Harga Tertinggi
                        </Button>
                    </div>
                </div>

                {/* Category Filter Carousel (Shopee/Tokopedia style) */}
                <div className="px-10">
                    <Carousel
                        opts={{
                            align: "start",
                            dragFree: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2">
                            <CarouselItem className="basis-auto pl-2">
                                <Button
                                    size="sm"
                                    variant={
                                        selectedSportType === undefined
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="rounded-full h-8 px-4 text-xs font-medium"
                                    onClick={() =>
                                        setSelectedSportType(undefined)
                                    }
                                >
                                    Semua Olahraga
                                </Button>
                            </CarouselItem>
                            {sportTypes.map((type) => (
                                <CarouselItem
                                    key={type.id}
                                    className="basis-auto pl-2"
                                >
                                    <Button
                                        size="sm"
                                        variant={
                                            selectedSportType === type.id
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="rounded-full h-8 px-4 text-xs font-medium"
                                        onClick={() =>
                                            setSelectedSportType(type.id)
                                        }
                                    >
                                        {type.name}
                                    </Button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-9 h-8 w-8" />
                        <CarouselNext className="-right-9 h-8 w-8" />
                    </Carousel>
                </div>

                {/* Dense Marketplace Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {[...Array(10)].map((_, i) => (
                            <FieldCardSkeleton key={i} />
                        ))}
                    </div>
                ) : fields.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {fields.map((field) => (
                            <FieldCard key={field.id} field={field} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-14 rounded-2xl border border-dashed bg-muted/20 text-muted-foreground">
                        <p className="font-medium">
                            Belum ada lapangan untuk kategori ini.
                        </p>
                    </div>
                )}

                {/* Browse All CTA */}
                <div className="flex justify-center pt-2">
                    <Link
                        href={
                            selectedSportType
                                ? `/fields?sport=${selectedSportType}`
                                : "/fields"
                        }
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 gap-2 group"
                        >
                            Lihat Semua Lapangan
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
