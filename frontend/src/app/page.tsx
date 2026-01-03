"use client";

import { useGetAllFields } from "@/hooks/useFields";
import { useGetHomeData } from "@/hooks/useHome";
import { useDebounce } from "@/hooks/useDebounce";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useState } from "react";

import { HeroSection } from "./(home)/components/HeroSection";
import { FeaturedFields } from "./(home)/components/FeaturedFields";
import { FeaturedVenues } from "./(home)/components/FeaturedVenues";
import { ValueProposition } from "./(home)/components/ValueProposition";
import { StatisticsBanner } from "./(home)/components/StatisticsBanner";
import { RenterCTA } from "./(home)/components/RenterCTA";

/**
 * Home Component
 *
 * Landing page for the application. Displays hero section with search,
 * featured fields and venues carousels, and value proposition sections.
 */
export default function Home() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    // Consolidated data fetch
    const { data: homeData, isLoading: isHomeLoading } = useGetHomeData();

    // Specialized hook for search suggestions only (triggered by user input)
    const { data: suggestions } = useGetAllFields(
        1,
        5,
        debouncedSearch.length > 0 ? debouncedSearch : undefined,
        "APPROVED",
        false
    );

    if (isHomeLoading) return <FullScreenLoader />;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 flex flex-col bg-background">
                <HeroSection
                    sportTypes={homeData?.sportTypes}
                    suggestions={suggestions?.data}
                />

                <FeaturedFields fields={homeData?.featuredFields || []} />

                <FeaturedVenues venues={homeData?.featuredVenues || []} />

                <ValueProposition />

                <StatisticsBanner
                    venueCount={homeData?.statistics?.venueCount}
                    fieldCount={homeData?.statistics?.fieldCount}
                    playerCount={homeData?.statistics?.playerCount}
                />

                <RenterCTA />
            </main>
        </div>
    );
}
