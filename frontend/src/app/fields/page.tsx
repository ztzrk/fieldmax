"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetPublicFields } from "@/hooks/useFields";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { useDebounce } from "@/hooks/useDebounce";
import { FieldCard } from "@/components/fields/FieldCard";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ActiveChip,
    ActiveFilterChips,
    CatalogFilterSidebar,
    MobileFilterDrawer,
    PriceFilter,
    SportTypeFilter,
} from "@/components/shared/CatalogFilters";
import { ArrowUpDown, RotateCcw, Search as SearchIcon } from "lucide-react";

type SortOption =
    | "default"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "newest";

const SORT_MAPPING: Record<
    SortOption,
    { sortBy: string; sortOrder: "asc" | "desc" }
> = {
    default: { sortBy: "venue.name", sortOrder: "asc" },
    price_asc: { sortBy: "pricePerHour", sortOrder: "asc" },
    price_desc: { sortBy: "pricePerHour", sortOrder: "desc" },
    name_asc: { sortBy: "name", sortOrder: "asc" },
    newest: { sortBy: "createdAt", sortOrder: "desc" },
};

function FieldsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialSportType = searchParams.get("sport") || undefined;
    const initialSearch = searchParams.get("search") ?? "";

    const [search, setSearch] = useState(initialSearch);
    const debouncedSearch = useDebounce(search, 300);
    const [selectedSportType, setSelectedSportType] = useState<
        string | undefined
    >(initialSportType);
    const [sortOption, setSortOption] = useState<SortOption>("default");
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        const paramSearch = searchParams.get("search") ?? "";
        const paramSport = searchParams.get("sport") || undefined;
        setSearch(paramSearch);
        setSelectedSportType(paramSport);
        setPage(1);
    }, [searchParams]);

    const { data: sportTypes = [] } = useGetAllSportTypesWithoutPagination();
    const { sortBy, sortOrder } = SORT_MAPPING[sortOption];

    const { data: fieldsData, isLoading: isFieldsLoading } = useGetPublicFields(
        page,
        pageSize,
        debouncedSearch.length > 0 ? debouncedSearch : undefined,
        false,
        selectedSportType,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice
    );

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedSportType(undefined);
        setSortOption("default");
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setPage(1);
        router.push("/fields");
    };

    const selectedSportName = useMemo(
        () => sportTypes.find((s) => s.id === selectedSportType)?.name,
        [sportTypes, selectedSportType]
    );

    const activeChips = useMemo<ActiveChip[]>(() => {
        const chips: ActiveChip[] = [];
        if (search.trim()) {
            chips.push({
                key: "search",
                label: `Cari: "${search.trim()}"`,
                onRemove: () => {
                    setSearch("");
                    setPage(1);
                },
            });
        }
        if (selectedSportType) {
            chips.push({
                key: "sport",
                label: `Olahraga: ${selectedSportName ?? "Terpilih"}`,
                onRemove: () => {
                    setSelectedSportType(undefined);
                    setPage(1);
                },
            });
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            const minText =
                minPrice !== undefined
                    ? `Rp ${minPrice.toLocaleString("id-ID")}`
                    : "Rp 0";
            const maxText =
                maxPrice !== undefined
                    ? `Rp ${maxPrice.toLocaleString("id-ID")}`
                    : "∞";
            chips.push({
                key: "price",
                label: `Harga: ${minText} – ${maxText}`,
                onRemove: () => {
                    setMinPrice(undefined);
                    setMaxPrice(undefined);
                    setPage(1);
                },
            });
        }
        return chips;
    }, [search, selectedSportType, selectedSportName, minPrice, maxPrice]);

    const activeSidebarFilterCount =
        (selectedSportType ? 1 : 0) +
        (minPrice !== undefined || maxPrice !== undefined ? 1 : 0);

    const hasAnyFilterOrSort =
        activeChips.length > 0 || sortOption !== "default";

    const totalPages = fieldsData?.meta?.totalPages || 1;

    const filterSections = (
        <div className="space-y-5">
            <SportTypeFilter
                sportTypes={sportTypes}
                selectedSportType={selectedSportType}
                onSelectSportType={(id) => {
                    setSelectedSportType(id);
                    setPage(1);
                }}
            />
            <Separator />
            <PriceFilter
                key={`${minPrice ?? ""}-${maxPrice ?? ""}`}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onApplyPrice={(min, max) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                    setPage(1);
                }}
            />
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {search
                            ? `Lapangan untuk "${search}"`
                            : "Semua Lapangan"}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {fieldsData?.meta?.total || 0} lapangan tersedia untuk
                        dipesan
                    </p>
                </div>

                {/* Marketplace 2-Column Layout */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left Sticky Filter Sidebar (Desktop) */}
                    <CatalogFilterSidebar
                        activeFilterCount={activeSidebarFilterCount}
                        onReset={handleResetFilters}
                    >
                        {filterSections}
                    </CatalogFilterSidebar>

                    {/* Right Content: Top Controls + Active Chips + Grid */}
                    <div className="flex-1 w-full min-w-0 space-y-5">
                        {/* Search + Mobile Filter + Sort Bar */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    aria-label="Cari nama lapangan atau tempat olahraga"
                                    placeholder="Cari nama lapangan atau tempat olahraga..."
                                    className="pl-9 w-full"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <MobileFilterDrawer
                                    activeFilterCount={activeSidebarFilterCount}
                                    onReset={handleResetFilters}
                                >
                                    {filterSections}
                                </MobileFilterDrawer>

                                <Select
                                    value={sortOption}
                                    onValueChange={(val: SortOption) => {
                                        setSortOption(val);
                                        setPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-[215px] bg-card">
                                        <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">
                                            Urutan Bawaan
                                        </SelectItem>
                                        <SelectItem value="price_asc">
                                            Harga: Termurah
                                        </SelectItem>
                                        <SelectItem value="price_desc">
                                            Harga: Termahal
                                        </SelectItem>
                                        <SelectItem value="name_asc">
                                            Nama Lapangan (A–Z)
                                        </SelectItem>
                                        <SelectItem value="newest">
                                            Terbaru
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Active Filter Chips */}
                        <ActiveFilterChips
                            chips={activeChips}
                            onResetAll={handleResetFilters}
                        />

                        {/* Grid Content */}
                        {isFieldsLoading ? (
                            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="rounded-xl border border-border/60 bg-card p-3 space-y-3 animate-pulse"
                                    >
                                        <div className="aspect-[4/3] w-full rounded-lg bg-muted" />
                                        <div className="h-4 w-3/4 rounded bg-muted" />
                                        <div className="h-3 w-1/2 rounded bg-muted" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                    {fieldsData?.data?.map(
                                        (
                                            field: FieldResponseSchema,
                                            index: number
                                        ) => (
                                            <FieldCard
                                                key={field.id}
                                                field={field}
                                                priority={index < 12}
                                            />
                                        )
                                    )}
                                </div>

                                {fieldsData?.data?.length === 0 && (
                                    <div className="text-center py-20 px-4 text-muted-foreground bg-card border border-dashed border-border rounded-2xl">
                                        <p className="text-lg font-semibold text-foreground">
                                            Lapangan tidak ditemukan
                                        </p>
                                        <p className="text-sm mt-1">
                                            Coba sesuaikan kata kunci, rentang
                                            harga, atau cabang olahraga Anda.
                                        </p>
                                        {hasAnyFilterOrSort && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-4 gap-1.5"
                                                onClick={handleResetFilters}
                                            >
                                                <RotateCcw className="h-3.5 w-3.5" />
                                                Reset Semua Filter
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.max(1, page - 1)
                                                )
                                            }
                                            disabled={page === 1}
                                        >
                                            Sebelumnya
                                        </Button>
                                        <span className="text-sm text-muted-foreground mx-2">
                                            Halaman {page} dari {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.min(
                                                        totalPages,
                                                        page + 1
                                                    )
                                                )
                                            }
                                            disabled={page === totalPages}
                                        >
                                            Selanjutnya
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function FieldsPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <FieldsContent />
        </Suspense>
    );
}
