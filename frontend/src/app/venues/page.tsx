"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { useDebounce } from "@/hooks/useDebounce";
import {
    Search,
    MapPin,
    Trophy,
    ArrowLeft,
    Building2,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/shared/UserNav";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export default function VenuesPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const router = useRouter();

    const { data: venues, isLoading: isVenuesLoading } = useGetPublicVenues();

    // Filter venues client-side for now since API might not support name search yet, 
    // or standard getAllPublic doesn't accept query. 
    // If backend supports it, we'd pass debouncedSearch to hook.
    // Assuming backend returns all (usually small list for venues), we filter here.
    const filteredVenues = venues?.filter(venue => 
        venue.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        venue.address?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

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
                            <Link href="/venues" className="text-sm font-medium hover:text-primary transition-colors text-primary">
                                Venues
                            </Link>
                        </nav>
                    </div>
                    
                    <div className="flex-1 max-w-xl mx-4">
                         <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search venues..."
                                className="pl-8 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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
                    <div className="flex justify-between items-center">
                         <h1 className="text-2xl font-bold">
                            {search ? `Venues matching "${search}"` : "All Venues"}
                         </h1>
                         <span className="text-muted-foreground text-sm">
                            {filteredVenues?.length || 0} venues found
                         </span>
                    </div>
                </div>

                {isVenuesLoading ? (
                    <FullScreenLoader />
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredVenues?.map((venue) => (
                            <Card 
                                key={venue.id} 
                                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                                onClick={() => router.push(`/venues/${venue.id}`)}
                            >
                                <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                     {venue.photos && venue.photos.length > 0 ? (
                                        <img 
                                            src={venue.photos[0].url} 
                                            alt={venue.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                        />
                                    ) : (
                                        <Building2 className="h-12 w-12 opacity-20" />
                                    )}
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg font-semibold mb-1" title={venue.name}>
                                        {venue.name}
                                    </CardTitle>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span className="line-clamp-1">{venue.address || "No address"}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                        <Badge variant="secondary">
                                            {venue._count?.fields || 0} Fields
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="gap-1 h-8">
                                            Details <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
                
                {!isVenuesLoading && filteredVenues?.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg">
                        <p className="text-xl">No venues found.</p>
                        <p className="text-sm mt-2">Try adjusting your search.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

function SearchIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    )
}
