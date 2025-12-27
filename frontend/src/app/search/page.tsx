"use client";

import { formatPrice } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetAllFields } from "@/hooks/useFields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin, ArrowRight, Loader2, Search as SearchIcon, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { UserNav } from "@/components/shared/UserNav";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Suspense } from "react";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { Building2 } from "lucide-react";

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams ? searchParams.get("q") || "" : "";
    const typeParam = searchParams ? searchParams.get("type") || "all" : "all"; // all, fields, venues

    const [search, setSearch] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState(typeParam === "venues" ? "venues" : (typeParam === "fields" ? "fields" : "all"));
    
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // Fetch Fields
    const { data: fieldsData, isLoading: isFieldsLoading } = useGetAllFields(
        1,
        50, // Limit for search results
        search,
        "APPROVED",
        false
    );

    // Fetch Venues
    const { data: venuesData, isLoading: isVenuesLoading } = useGetPublicVenues();
    
    // Filter Venues Client-side
    const filteredVenues = venuesData?.filter(venue => 
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
    }

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
                        <div className="flex gap-2 items-center font-bold text-xl cursor-pointer" onClick={() => router.push("/")}>
                            <ArrowLeft className="h-5 w-5" />
                            <Trophy className="h-6 w-6 text-primary" />
                            <span>FieldMax</span>
                        </div>
                        <nav className="hidden lg:flex items-center gap-4">
                            <Link href="/fields" className="text-sm font-medium hover:text-primary transition-colors">
                                Fields
                            </Link>
                            <Link href="/venues" className="text-sm font-medium hover:text-primary transition-colors">
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

                <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="all">All Results</TabsTrigger>
                        <TabsTrigger value="fields">Fields ({fieldsData?.meta?.total || 0})</TabsTrigger>
                        <TabsTrigger value="venues">Venues ({filteredVenues.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-8">
                        {/* Fields Section in All */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Fields</h2>
                                <Button variant="link" onClick={() => setActiveTab("fields")}>View All Fields</Button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {fieldsData?.data?.slice(0, 4).map((field: any) => (
                                    <Card 
                                        key={field.id} 
                                        className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group"
                                        onClick={() => router.push(`/fields/${field.id}`)}
                                    >
                                         <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                            {field.photos && field.photos.length > 0 ? (
                                                <img src={field.photos[0].url} alt={field.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                                            ) : (
                                                <Trophy className="h-8 w-8 opacity-20" />
                                            )}
                                        </div>
                                        <CardHeader className="p-3">
                                            <CardTitle className="text-sm line-clamp-1">{field.name}</CardTitle>
                                            <div className="text-xs text-muted-foreground line-clamp-1">{field.venue.name}</div>
                                        </CardHeader>
                                    </Card>
                                ))}
                                {(!fieldsData?.data || fieldsData.data.length === 0) && <p className="text-muted-foreground italic">No fields found.</p>}
                            </div>
                        </div>

                        {/* Venues Section in All */}
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Venues</h2>
                                <Button variant="link" onClick={() => setActiveTab("venues")}>View All Venues</Button>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {filteredVenues.slice(0, 4).map((venue) => (
                                    <Card 
                                        key={venue.id} 
                                        className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group"
                                        onClick={() => router.push(`/venues/${venue.id}`)}
                                    >
                                         <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                            {venue.photos && venue.photos.length > 0 ? (
                                                <img src={venue.photos[0].url} alt={venue.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                                            ) : (
                                                <Building2 className="h-8 w-8 opacity-20" />
                                            )}
                                        </div>
                                        <CardHeader className="p-3">
                                            <CardTitle className="text-sm line-clamp-1">{venue.name}</CardTitle>
                                            <div className="text-xs text-muted-foreground line-clamp-1">{venue.address}</div>
                                        </CardHeader>
                                    </Card>
                                ))}
                                {filteredVenues.length === 0 && <p className="text-muted-foreground italic">No venues found.</p>}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="fields">
                         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {fieldsData?.data?.map((field: any) => (
                                <Card 
                                    key={field.id} 
                                    className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group"
                                    onClick={() => router.push(`/fields/${field.id}`)}
                                >
                                     <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                        {field.photos && field.photos.length > 0 ? (
                                            <img src={field.photos[0].url} alt={field.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                                        ) : (
                                            <Trophy className="h-8 w-8 opacity-20" />
                                        )}
                                    </div>
                                    <CardHeader className="p-3 pb-0">
                                        <div className="flex justify-between items-start">
                                            <div className="w-full">
                                                <Badge variant="outline" className="mb-1 text-[10px] px-1.5 py-0 h-4">{field.sportType.name}</Badge>
                                                <CardTitle className="line-clamp-1 text-sm font-semibold">{field.name}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="line-clamp-1">{field.venue.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-sm font-bold">{formatPrice(field.pricePerHour)}/hr</span>
                                            <Button size="sm" variant="secondary" className="h-7 px-2 text-xs gap-1 hover:bg-primary hover:text-primary-foreground">
                                                Book <ArrowRight className="h-2.5 w-2.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {(!fieldsData?.data || fieldsData.data.length === 0) && (
                            <div className="text-center py-20 text-muted-foreground">No fields found.</div>
                        )}
                    </TabsContent>

                    <TabsContent value="venues">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredVenues.map((venue) => (
                                <Card 
                                    key={venue.id} 
                                    className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group"
                                    onClick={() => router.push(`/venues/${venue.id}`)}
                                >
                                     <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                        {venue.photos && venue.photos.length > 0 ? (
                                            <img src={venue.photos[0].url} alt={venue.name} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                                        ) : (
                                            <Building2 className="h-8 w-8 opacity-20" />
                                        )}
                                    </div>
                                    <CardHeader className="p-3 pb-0">
                                        <CardTitle className="line-clamp-1 text-sm font-semibold">{venue.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="line-clamp-1">{venue.address}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <Badge variant="secondary" className="text-[10px]">{venue._count?.fields || 0} Fields</Badge>
                                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1 hover:bg-primary/10">
                                                Details <ArrowRight className="h-2.5 w-2.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {filteredVenues.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">No venues found.</div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <SearchContent />
        </Suspense>
    );
}
