"use client";

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

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams ? searchParams.get("q") || "" : "";
    const [search, setSearch] = useState(initialQuery);
    // Remove debounce here to search immediately on typing or keep it?
    // User said "show all searched". The page is likely the result of a search.
    // But allowing further searching on this page is good.
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    // Update query url when search changes? Or just search locally?
    // Usually search pages update URL on submit.
    // For now, let's just use the 'search' state to trigger the query,
    // and maybe update the URL?
    
    // Actually, if we want "enter to go to search page", this page receives the query.
    // If user types in THIS page, should it update immediately? 
    // Let's implement immediate update for responsiveness here since we are already on the search page.

    const { data: fieldsData, isLoading: isFieldsLoading } = useGetAllFields(
        1,
        100, // Fetch more for search results
        search,
        "APPROVED",
        false
    );

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
             router.push(`/search?q=${search}`);
        }
    }

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
                            <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                                Fields
                            </Link>
                            <Link href="/search?type=venues" className="text-sm font-medium hover:text-primary transition-colors">
                                Venues
                            </Link>
                        </nav>
                    </div>
                    
                    <div className="flex-1 max-w-xl mx-4">
                         <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search fields..."
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

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                     <h1 className="text-2xl font-bold">
                        {search ? `Search Results for "${search}"` : "All Fields"}
                     </h1>
                     <span className="text-muted-foreground">
                        {fieldsData?.meta?.total || 0} results found
                     </span>
                </div>

                {isFieldsLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {fieldsData?.data?.map((field: any) => (
                            <Card key={field.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                    {field.photos && field.photos.length > 0 ? (
                                        <img 
                                            src={field.photos[0].url} 
                                            alt={field.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                        />
                                    ) : (
                                        <Trophy className="h-12 w-12 opacity-20" />
                                    )}
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Badge variant="outline" className="mb-2">
                                                {field.sportType.name}
                                            </Badge>
                                            <CardTitle className="line-clamp-1 text-lg">
                                                {field.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span className="line-clamp-1">{field.venue.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold">${field.pricePerHour}/hr</span>
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            className="gap-1"
                                            onClick={() => {
                                                if (!user) {
                                                    window.location.replace("/login");
                                                }
                                            }}
                                        >
                                            Book Now <ArrowRight className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                
                {!isFieldsLoading && fieldsData?.data?.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg">
                        <p className="text-xl">No fields found.</p>
                        <p className="text-sm mt-2">Try adjusting your search terms.</p>
                    </div>
                )}
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
