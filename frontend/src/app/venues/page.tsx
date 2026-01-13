"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { useDebounce } from "@/hooks/useDebounce";
import { Search as SearchIcon } from "lucide-react";
import { VenueCard } from "@/components/venues/VenueCard";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { Button } from "@/components/ui/button";

/**
 * VenuesPage Component
 *
 * Public listing of all venues. Supports searching by name/address.
 * Displays results in a responsive grid of VenueCards with pagination.
 */
export default function VenuesPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [page, setPage] = useState(1);
    const pageSize = 30;

    const { data: venuesData, isLoading: isVenuesLoading } = useGetPublicVenues(
        page,
        pageSize,
        debouncedSearch
    );

    const totalPages = venuesData?.meta?.totalPages || 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {search
                                    ? `Venues matching "${search}"`
                                    : "All Venues"}
                            </h1>
                            <span className="text-muted-foreground text-sm">
                                {venuesData?.meta?.total || 0} venues found
                            </span>
                        </div>
                        <div className="relative w-full md:w-72">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search venues..."
                                className="pl-8 w-full"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1); // Reset to page 1 on search
                                }}
                            />
                        </div>
                    </div>
                </div>

                {isVenuesLoading ? (
                    <FullScreenLoader />
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                            {venuesData?.data?.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>

                        {!isVenuesLoading && venuesData?.data?.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg">
                                <p className="text-xl">No venues found.</p>
                                <p className="text-sm mt-2">
                                    Try adjusting your search terms.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(Math.max(1, page - 1))
                                    }
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground mx-2">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(
                                            Math.min(totalPages, page + 1)
                                        )
                                    }
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
