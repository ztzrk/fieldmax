"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllFields } from "@/hooks/useFields";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { useDebounce } from "@/hooks/useDebounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import { FieldCard } from "@/components/fields/FieldCard";
import { VenueCard } from "@/components/venues/VenueCard";
import { SearchHeader } from "./components/SearchHeader";
import { Search, MapPin, Trophy } from "lucide-react";

function ResultsGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {children}
        </div>
    );
}

function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof Search;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 border border-border/50 rounded-xl my-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {description}
            </p>
        </div>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams ? searchParams.get("q") || "" : "";
    const typeParam = searchParams ? searchParams.get("type") || "all" : "all";

    const [search, setSearch] = useState(initialQuery);
    const debouncedSearch = useDebounce(search, 300);

    const [activeTab, setActiveTab] = useState(
        typeParam === "venues"
            ? "venues"
            : typeParam === "fields"
            ? "fields"
            : "all"
    );
    const router = useRouter();

    // Fetch Fields server-side with debounced search
    const { data: fieldsData, isLoading: isFieldsLoading } = useGetAllFields(
        1,
        50,
        debouncedSearch.length > 0 ? debouncedSearch : undefined,
        "APPROVED",
        false
    );

    // Fetch Venues server-side with debounced search
    const { data: venuesData, isLoading: isVenuesLoading } = useGetPublicVenues(
        1,
        50,
        debouncedSearch.length > 0 ? debouncedSearch : undefined
    );

    const venuesList = venuesData?.data || [];
    const fieldsList = fieldsData?.data || [];

    const totalFields = fieldsData?.meta?.total ?? fieldsList.length;
    const totalVenues = venuesData?.meta?.total ?? venuesList.length;

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const newParams = new URLSearchParams(searchParams?.toString());
            if (search) newParams.set("q", search);
            else newParams.delete("q");
            router.push(`/search?${newParams.toString()}`);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SearchHeader
                search={search}
                onSearchChange={setSearch}
                onSearchSubmit={handleSearch}
            />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {debouncedSearch
                            ? `Hasil pencarian untuk "${debouncedSearch}"`
                            : "Pencarian Lapangan & Venue"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Temukan lapangan olahraga terbaik di sekitar Anda dengan ketersediaan jadwal real-time.
                    </p>
                </div>

                <Tabs
                    defaultValue={activeTab}
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="mb-8">
                        <TabsTrigger value="all">
                            Semua Hasil ({totalFields + totalVenues})
                        </TabsTrigger>
                        <TabsTrigger value="fields">
                            Lapangan ({totalFields})
                        </TabsTrigger>
                        <TabsTrigger value="venues">
                            Venue ({totalVenues})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-10">
                        {/* Fields Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-primary" />
                                    Lapangan ({totalFields})
                                </h2>
                            </div>
                            {fieldsList.length > 0 ? (
                                <ResultsGrid>
                                    {fieldsList.map(
                                        (field: FieldResponseSchema) => (
                                            <FieldCard
                                                key={field.id}
                                                field={field}
                                            />
                                        )
                                    )}
                                </ResultsGrid>
                            ) : (
                                <EmptyState
                                    icon={Trophy}
                                    title="Tidak ada lapangan ditemukan"
                                    description={
                                        debouncedSearch
                                            ? `Tidak ada lapangan yang cocok dengan "${debouncedSearch}". Coba kata kunci lain.`
                                            : "Belum ada lapangan yang tersedia saat ini."
                                    }
                                />
                            )}
                        </div>

                        {/* Venues Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Venue & Lokasi ({totalVenues})
                                </h2>
                            </div>
                            {venuesList.length > 0 ? (
                                <ResultsGrid>
                                    {venuesList.map((venue) => (
                                        <VenueCard
                                            key={venue.id}
                                            venue={venue}
                                        />
                                    ))}
                                </ResultsGrid>
                            ) : (
                                <EmptyState
                                    icon={MapPin}
                                    title="Tidak ada venue ditemukan"
                                    description={
                                        debouncedSearch
                                            ? `Tidak ada venue yang cocok dengan "${debouncedSearch}". Coba gunakan nama kota atau nama venue.`
                                            : "Belum ada venue yang terdaftar saat ini."
                                    }
                                />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="fields">
                        {fieldsList.length > 0 ? (
                            <ResultsGrid>
                                {fieldsList.map(
                                    (field: FieldResponseSchema) => (
                                        <FieldCard
                                            key={field.id}
                                            field={field}
                                        />
                                    )
                                )}
                            </ResultsGrid>
                        ) : (
                            <EmptyState
                                icon={Trophy}
                                title="Tidak ada lapangan ditemukan"
                                description={
                                    debouncedSearch
                                        ? `Tidak ada lapangan yang cocok dengan "${debouncedSearch}".`
                                        : "Belum ada lapangan yang terdaftar."
                                }
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="venues">
                        {venuesList.length > 0 ? (
                            <ResultsGrid>
                                {venuesList.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </ResultsGrid>
                        ) : (
                            <EmptyState
                                icon={MapPin}
                                title="Tidak ada venue ditemukan"
                                description={
                                    debouncedSearch
                                        ? `Tidak ada venue yang cocok dengan "${debouncedSearch}".`
                                        : "Belum ada venue yang terdaftar."
                                }
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Memuat pencarian...</div>}>
            <SearchContent />
        </Suspense>
    );
}
