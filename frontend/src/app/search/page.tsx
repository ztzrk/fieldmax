"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllFields } from "@/hooks/useFields";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import { FieldCard } from "@/components/fields/FieldCard";
import { VenueCard } from "@/components/venues/VenueCard";
import { SearchHeader } from "./components/SearchHeader";

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams ? searchParams.get("q") || "" : "";
    const typeParam = searchParams ? searchParams.get("type") || "all" : "all";

    const [search, setSearch] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState(
        typeParam === "venues"
            ? "venues"
            : typeParam === "fields"
            ? "fields"
            : "all"
    );
    const router = useRouter();

    // Fetch Fields
    const { data: fieldsData } = useGetAllFields(
        1,
        50,
        search,
        "APPROVED",
        false
    );

    // Fetch Venues
    const { data: venuesData } = useGetPublicVenues();

    // Filter Venues Client-side
    const filteredVenues =
        venuesData?.data?.filter(
            (venue) =>
                !search ||
                venue.name.toLowerCase().includes(search.toLowerCase()) ||
                venue.address?.toLowerCase().includes(search.toLowerCase())
        ) || [];

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const newParams = new URLSearchParams(searchParams?.toString());
            if (search) newParams.set("q", search);
            else newParams.delete("q");
            router.push(`/search?${newParams.toString()}`);
        }
    };

    const ResultsGrid = ({ children }: { children: React.ReactNode }) => (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {children}
        </div>
    );

    const EmptyState = ({ message }: { message: string }) => (
        <p className="text-muted-foreground italic">{message}</p>
    );

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SearchHeader
                search={search}
                onSearchChange={setSearch}
                onSearchSubmit={handleSearch}
            />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 mb-8">
                    <h1 className="text-2xl font-bold">
                        {search ? `Results for "${search}"` : "Search"}
                    </h1>
                </div>

                <Tabs
                    defaultValue={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="mb-8">
                        <TabsTrigger value="all">All Results</TabsTrigger>
                        <TabsTrigger value="fields">
                            Fields ({fieldsData?.meta?.total || 0})
                        </TabsTrigger>
                        <TabsTrigger value="venues">
                            Venues ({filteredVenues.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-8">
                        {/* Fields Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Fields</h2>
                            <ResultsGrid>
                                {fieldsData?.data?.map(
                                    (field: FieldResponseSchema) => (
                                        <FieldCard
                                            key={field.id}
                                            field={field}
                                        />
                                    )
                                )}
                                {(!fieldsData?.data ||
                                    fieldsData.data.length === 0) && (
                                    <EmptyState message="No fields found." />
                                )}
                            </ResultsGrid>
                        </div>

                        {/* Venues Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Venues</h2>
                            <ResultsGrid>
                                {filteredVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                                {filteredVenues.length === 0 && (
                                    <EmptyState message="No venues found." />
                                )}
                            </ResultsGrid>
                        </div>
                    </TabsContent>

                    <TabsContent value="fields">
                        <ResultsGrid>
                            {fieldsData?.data?.map(
                                (field: FieldResponseSchema) => (
                                    <FieldCard key={field.id} field={field} />
                                )
                            )}
                            {(!fieldsData?.data ||
                                fieldsData.data.length === 0) && (
                                <EmptyState message="No fields found." />
                            )}
                        </ResultsGrid>
                    </TabsContent>

                    <TabsContent value="venues">
                        <ResultsGrid>
                            {filteredVenues.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                            {filteredVenues.length === 0 && (
                                <EmptyState message="No venues found." />
                            )}
                        </ResultsGrid>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
