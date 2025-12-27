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

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams ? searchParams.get("q") || "" : "";
    const initialSportTypeId = searchParams ? searchParams.get("sportTypeId") || undefined : undefined;
    
    const [search, setSearch] = useState(initialQuery);
    const [selectedSportType, setSelectedSportType] = useState<string | undefined>(initialSportTypeId);
    
    const { user, isLoading: isAuthLoading } = useAuth();
    const { data: sportTypes } = useGetAllSportTypesWithoutPagination();
    const router = useRouter();

    const { data: fieldsData, isLoading: isFieldsLoading } = useGetAllFields(
        1,
        100, 
        search,
        "APPROVED",
        false,
        selectedSportType
    );

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
             const newParams = new URLSearchParams(searchParams?.toString());
             if (search) newParams.set("q", search);
             else newParams.delete("q");
             if (selectedSportType) newParams.set("sportTypeId", selectedSportType);
             else newParams.delete("sportTypeId");
             router.push(`/search?${newParams.toString()}`);
        }
    }

    const toggleSportType = (id: string | undefined) => {
        setSelectedSportType(id);
        const newParams = new URLSearchParams(searchParams?.toString());
        if (id) newParams.set("sportTypeId", id);
        else newParams.delete("sportTypeId");
        if (search) newParams.set("q", search);
        router.push(`/search?${newParams.toString()}`);
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

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex justify-between items-center">
                         <h1 className="text-2xl font-bold">
                            {search ? `Search Results for "${search}"` : "All Fields"}
                         </h1>
                         <span className="text-muted-foreground text-sm">
                            {fieldsData?.meta?.total || 0} fields found
                         </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant={selectedSportType === undefined ? "default" : "outline"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => toggleSportType(undefined)}
                        >
                            All Sports
                        </Button>
                        {sportTypes?.map((type) => (
                            <Button
                                key={type.id}
                                variant={selectedSportType === type.id ? "default" : "outline"}
                                size="sm"
                                className="rounded-full"
                                onClick={() => toggleSportType(type.id)}
                            >
                                {type.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {isFieldsLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {fieldsData?.data?.map((field: any) => (
                            <Card 
                                key={field.id} 
                                className="overflow-hidden hover:shadow-lg transition-shadow p-0 gap-0 cursor-pointer group"
                                onClick={() => router.push(`/fields/${field.id}`)}
                            >
                                <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground relative overflow-hidden">
                                    {field.photos && field.photos.length > 0 ? (
                                        <img 
                                            src={field.photos[0].url} 
                                            alt={field.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                        />
                                    ) : (
                                        <Trophy className="h-8 w-8 opacity-20" />
                                    )}
                                </div>
                                <CardHeader className="p-3 pb-0">
                                    <div className="flex justify-between items-start">
                                        <div className="w-full">
                                            <Badge variant="outline" className="mb-1 text-[10px] px-1.5 py-0 h-4">
                                                {field.sportType.name}
                                            </Badge>
                                            <CardTitle className="line-clamp-1 text-sm font-semibold" title={field.name}>
                                                {field.name}
                                            </CardTitle>
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
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            className="h-7 px-2 text-xs gap-1 hover:bg-primary hover:text-primary-foreground"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!user) {
                                                    window.location.replace("/login");
                                                }
                                            }}
                                        >
                                            Book <ArrowRight className="h-2.5 w-2.5" />
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
