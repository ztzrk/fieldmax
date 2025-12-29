"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { VenueCard } from "@/components/venues/VenueCard";

export default function VenuesPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const router = useRouter();

    const { data: venues, isLoading: isVenuesLoading } = useGetPublicVenues();

    const filteredVenues = venues?.filter(venue => 
        venue.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        venue.address?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <div className="flex min-h-screen flex-col bg-background">

            <main className="flex-1 container py-8 px-4 md:px-6 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Browse Venues</h1>
                        <p className="text-muted-foreground mt-1">
                            Discover top-rated sports venues for your next game.
                        </p>
                    </div>
                    
                    <div className="flex-1 max-w-sm">
                         <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search venues..."
                                className="pl-8 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {isVenuesLoading ? (
                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <div className="h-[200px] w-full rounded-xl bg-muted animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredVenues?.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                        {filteredVenues?.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No venues found</h3>
                                <p className="text-muted-foreground mt-1">
                                    Try adjusting your search terms or browse all venues.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

