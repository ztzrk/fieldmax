"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { useDebounce } from "@/hooks/useDebounce";
import { ArrowUpDown, RotateCcw, Search as SearchIcon } from "lucide-react";
import { VenueCard } from "@/components/venues/VenueCard";
import { Button } from "@/components/ui/button";
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
    SportTypeFilter,
} from "@/components/shared/CatalogFilters";

type VenueSortOption = "newest" | "name_asc" | "name_desc" | "fields_desc";

const VENUE_SORT_MAPPING: Record<
    VenueSortOption,
    { sortBy: string; sortOrder: "asc" | "desc" }
> = {
    newest: { sortBy: "createdAt", sortOrder: "desc" },
    name_asc: { sortBy: "name", sortOrder: "asc" },
    name_desc: { sortBy: "name", sortOrder: "desc" },
    fields_desc: { sortBy: "fields", sortOrder: "desc" },
};

/**
 * VenuesPage Component
 *
 * Public listing of all venues. Supports searching by name/address,
 * filtering by available sport type, and sorting.
 */
export default function VenuesPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [selectedSportType, setSelectedSportType] = useState<
        string | undefined
    >(undefined);
    const [sortOption, setSortOption] = useState<VenueSortOption>("newest");
    const [page, setPage] = useState(1);
    const pageSize = 24;

    const { data: sportTypes = [] } = useGetAllSportTypesWithoutPagination();
    const { sortBy, sortOrder } = VENUE_SORT_MAPPING[sortOption];

    const { data: venuesData, isLoading: isVenuesLoading } =
        useGetPublicVenues(
            page,
            pageSize,
            debouncedSearch.length > 0 ? debouncedSearch : undefined,
            sortBy,
            sortOrder,
            selectedSportType
        );

    const totalPages = venuesData?.meta?.totalPages || 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedSportType(undefined);
        setSortOption("newest");
        setPage(1);
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
        return chips;
    }, [search, selectedSportType, selectedSportName]);

    const activeSidebarFilterCount = selectedSportType ? 1 : 0;
    const hasAnyFilterOrSort =
        activeChips.length > 0 || sortOption !== "newest";

    const filterSections = (
        <SportTypeFilter
            title="Tersedia Olahraga"
            sportTypes={sportTypes}
            selectedSportType={selectedSportType}
            onSelectSportType={(id) => {
                setSelectedSportType(id);
                setPage(1);
            }}
        />
    );

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {search
                            ? `Tempat Olahraga untuk "${search}"`
                            : "Semua Tempat Olahraga"}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {venuesData?.meta?.total || 0} tempat olahraga ditemukan
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
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari nama atau alamat tempat olahraga..."
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
                                    onValueChange={(val: VenueSortOption) => {
                                        setSortOption(val);
                                        setPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-[215px] bg-card">
                                        <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
                                        <SelectValue placeholder="Urutkan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">
                                            Terbaru
                                        </SelectItem>
                                        <SelectItem value="name_asc">
                                            Nama Tempat (A–Z)
                                        </SelectItem>
                                        <SelectItem value="name_desc">
                                            Nama Tempat (Z–A)
                                        </SelectItem>
                                        <SelectItem value="fields_desc">
                                            Lapangan Terbanyak
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <ActiveFilterChips
                            chips={activeChips}
                            onResetAll={handleResetFilters}
                        />

                        {isVenuesLoading ? (
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
                                    {venuesData?.data?.map((venue, index) => (
                                        <VenueCard
                                            key={venue.id}
                                            venue={venue}
                                            priority={index < 12}
                                        />
                                    ))}
                                </div>

                                {venuesData?.data?.length === 0 && (
                                    <div className="text-center py-20 px-4 text-muted-foreground bg-card border border-dashed border-border rounded-2xl">
                                        <p className="text-lg font-semibold text-foreground">
                                            Tempat olahraga tidak ditemukan
                                        </p>
                                        <p className="text-sm mt-1">
                                            Coba ubah kata kunci pencarian atau
                                            filter olahraga Anda.
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
