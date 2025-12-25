
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useGetAllFields } from "@/hooks/useFields";
import { useDebounce } from "@/hooks/useDebounce";
import {
    LayoutDashboard,
    Search,
    MapPin,
    Trophy,
    ArrowRight,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/shared/UserNav";
import { FullScreenLoader } from "@/components/FullScreenLoader";

export default function Home() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const router = useRouter();

    const { data: suggestions } = useGetAllFields(
        1,
        5,
        debouncedSearch.length > 0 ? debouncedSearch : undefined, // Only search if there is text
        "APPROVED",
        false
    );

    const { data, isLoading: isFieldsLoading } = useGetAllFields(
        1,
        12, 
        "", // No search on home page, just featured/latest
        "APPROVED", 
        false 
    );

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim()) {
            router.push(`/search?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Navbar */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <div className="flex gap-2 items-center font-bold text-xl">
                            <Trophy className="h-6 w-6 text-primary" />
                            <span>FieldMax</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/search" className="text-sm font-medium hover:text-primary transition-colors">
                                Fields
                            </Link>
                            <Link href="/search?type=venues" className="text-sm font-medium hover:text-primary transition-colors">
                                Venues
                            </Link>
                        </nav>
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

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-muted/50">
                    <div className="w-full px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                Find Your Perfect <span className="text-primary">Field</span>
                            </h1>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Browse top-rated sports venues and book instantly.
                            </p>
                            
                            <div className="w-full max-w-sm space-y-2 relative">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by field name..."
                                        className="pl-8"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                </div>
                                
                                {search.length > 0 && suggestions?.data && suggestions.data.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95">
                                        <div className="p-1">
                                            {suggestions.data.map((field) => (
                                                <div
                                                    key={field.id}
                                                    className="flex items-center gap-2 p-2 rounded-sm hover:bg-muted cursor-pointer transition-colors"
                                                    onClick={() => router.push(`/search?q=${encodeURIComponent(field.name)}`)}
                                                >
                                                    {field.photos && field.photos.length > 0 ? (
                                                        <img 
                                                            src={field.photos[0].url} 
                                                            alt={field.name}
                                                            className="h-8 w-8 rounded-sm object-cover"
                                                        />
                                                    ) : (
                                                        <Trophy className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium leading-none">{field.name}</span>
                                                        <span className="text-xs text-muted-foreground">{field.venue.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <div 
                                                className="flex items-center gap-2 p-2 rounded-sm hover:bg-muted cursor-pointer transition-colors border-t mt-1 text-primary"
                                                onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
                                            >
                                                <Search className="h-4 w-4" />
                                                <span className="text-sm font-medium">See all results for "{search}"</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Marketplace Grid */}
                <section className="w-full py-12 bg-background">
                    <div className="w-full px-4 md:px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">Available Fields</h2>
                            <Link href="/search">
                                <Button variant="ghost" className="gap-1">
                                    See All <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {isFieldsLoading ? (
                            <FullScreenLoader/>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {data?.data?.map((field) => (
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
                                                <span className="text-xl font-bold">Rp. {field.pricePerHour}/hr</span>
                                                    <Button 
                                                        size="sm" 
                                                        variant="secondary" 
                                                        className="gap-1"
                                                        onClick={() => {
                                                            if (!user) {
                                                                window.location.href = "/login";
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
                        {!isFieldsLoading && data?.data?.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No fields found matching your criteria.
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
