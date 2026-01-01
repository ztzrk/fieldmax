"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllFields } from "@/hooks/useFields";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trophy, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { FieldCard } from "@/components/fields/FieldCard";
import { VenueCard } from "@/components/venues/VenueCard";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { UserNav } from "@/components/shared/UserNav";

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

    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // Fetch Fields
    const { data: fieldsData } = useGetAllFields(
        1,
        50, // Limit for search results
        search,
        "APPROVED",
        false
    );

    // Fetch Venues
    const { data: venuesData } = useGetPublicVenues();

    // Filter Venues Client-side
    const filteredVenues =
        venuesData?.filter(
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

            // Maintain type if necessary, or default to current tab
            router.push(`/search?${newParams.toString()}`);
        }
    };

    // Effect to update browser URL when tab changes (optional but good for sharing)
    const onTabChange = (value: string) => {
        setActiveTab(value);
        // Note: We don't necessarily need to push URL on tab change unless we want deep linking
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Navbar */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="flex gap-2 items-center font-bold text-xl"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <Trophy className="h-6 w-6 text-primary" />
                            <span>FieldMax</span>
                        </Link>
                        <nav className="hidden lg:flex items-center gap-4">
                            <Link
                                href="/fields"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Fields
                            </Link>
                            <Link
                                href="/venues"
                                className="text-sm font-medium hover:text-primary transition-colors"
                            >
                                Venues
                            </Link>
                        </nav>
                    </div>

                    <div className="flex-1 max-w-xl mx-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search fields max..."
                                className="pl-8 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthLoading ? (
                            <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
                        ) : user ? (
                            <UserNav />
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/login">
                                    <Button variant="ghost">Log In</Button>
                                </Link>
                                <Link href="/register">
                                    <Button>Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 mb-8">
                    <h1 className="text-2xl font-bold">
                        {search ? `Results for "${search}"` : "Search"}
                    </h1>
                </div>

                <Tabs
                    defaultValue={activeTab}
                    onValueChange={onTabChange}
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
                        {/* Fields Section in All */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Fields
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
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
                                    <p className="text-muted-foreground italic">
                                        No fields found.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Venues Section in All */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">
                                    Venues
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                                {filteredVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                                {filteredVenues.length === 0 && (
                                    <p className="text-muted-foreground italic">
                                        No venues found.
                                    </p>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="fields">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {fieldsData?.data?.map(
                                (field: FieldResponseSchema) => (
                                    <FieldCard key={field.id} field={field} />
                                )
                            )}
                        </div>
                        {(!fieldsData?.data ||
                            fieldsData.data.length === 0) && (
                            <div className="text-center py-20 text-muted-foreground">
                                No fields found.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="venues">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {filteredVenues.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>
                        {filteredVenues.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No venues found.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<FullScreenLoader />}>
            <SearchContent />
        </Suspense>
    );
}
