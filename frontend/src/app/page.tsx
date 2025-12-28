
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useGetAllFields } from "@/hooks/useFields";
import { useGetPublicVenues } from "@/hooks/useVenues";
import { useDebounce } from "@/hooks/useDebounce";
import {
    Search,
    Trophy,
    ArrowRight,
    Zap,
    Shield,
    Users
} from "lucide-react";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Navbar } from "@/components/layout/Navbar";
import { VenueCard } from "@/components/venues/VenueCard";
import { FieldCard } from "@/components/fields/FieldCard";

export default function Home() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [selectedSportType, setSelectedSportType] = useState<string | undefined>(undefined);
    const router = useRouter();

    const { data: sportTypes } = useGetAllSportTypesWithoutPagination();

    const { data: suggestions } = useGetAllFields(
        1,
        5,
        debouncedSearch.length > 0 ? debouncedSearch : undefined,
        "APPROVED",
        false,
        selectedSportType
    );

    const { data, isLoading: isFieldsLoading } = useGetAllFields(
        1,
        24, 
        "", 
        "APPROVED", 
        false,
        selectedSportType
    );


    const { data: venues, isLoading: isVenuesLoading } = useGetPublicVenues();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim()) {
            router.push(`/search?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />

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

                            {/* Sport Type Filters */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                                <Button
                                    variant={selectedSportType === undefined ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => setSelectedSportType(undefined)}
                                >
                                    All
                                </Button>
                                {sportTypes?.map((type) => (
                                    <Button
                                        key={type.id}
                                        variant={selectedSportType === type.id ? "default" : "outline"}
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => setSelectedSportType(type.id)}
                                    >
                                        {type.name}
                                    </Button>
                                ))}
                            </div>

                        </div>
                    </div>
                </section>

                {/* Fields Section */}
                <section className="w-full py-12 bg-background">
                    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">Available Fields</h2>
                            <Link href="/fields">
                                <Button variant="ghost" className="gap-1">
                                    See All <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {isFieldsLoading ? (
                            <FullScreenLoader/>
                        ) : (
                            <div className="px-10">
                                <Carousel
                                    opts={{
                                        align: "start",
                                        loop: true,
                                    }}
                                    className="w-full"
                                >
                                    <CarouselContent>
                                        {data?.data?.map((field) => (
                                            <CarouselItem key={field.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5 2xl:basis-1/6">
                                                <FieldCard field={field} />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        )}
                        {!isFieldsLoading && data?.data?.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No fields found matching your criteria.
                            </div>
                        )}
                    </div>
                </section>

                {/* Venues Section */}
                <section className="w-full py-12 bg-muted/20">
                    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold tracking-tight">Available Venues</h2>
                            <Link href="/venues">
                                <Button variant="ghost" className="gap-1">
                                    See All <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {isVenuesLoading ? (
                            <FullScreenLoader />
                        ) : (
                            <div className="px-10">
                                <Carousel
                                    opts={{
                                        align: "start",
                                        loop: true,
                                    }}
                                    className="w-full"
                                >
                                    <CarouselContent>
                                        {venues?.map((venue) => (
                                            <CarouselItem key={venue.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5 2xl:basis-1/6">
                                                <VenueCard venue={venue} />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        )}
                        {!isVenuesLoading && venues?.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground">
                                No venues found.
                            </div>
                        )}
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="w-full py-16 bg-muted/30">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Book with FieldMax</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                We make sports booking seamless, secure, and simple.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                             <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
                                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
                                <p className="text-muted-foreground">
                                    Real-time availability and immediate confirmation. No more phone calls.
                                </p>
                             </div>
                             <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
                                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                                <p className="text-muted-foreground">
                                    Your transactions are protected with top-tier security standards.
                                </p>
                             </div>
                             <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
                                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
                                <p className="text-muted-foreground">
                                    Join thousands of players and trusted venue owners.
                                </p>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="w-full py-20 bg-primary text-primary-foreground">
                     <div className="container mx-auto px-4 md:px-6">
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                             <div>
                                 <div className="text-4xl md:text-5xl font-extrabold mb-2">100+</div>
                                 <div className="text-primary-foreground/80 font-medium">Verified Venues</div>
                             </div>
                             <div>
                                 <div className="text-4xl md:text-5xl font-extrabold mb-2">500+</div>
                                 <div className="text-primary-foreground/80 font-medium">Premium Fields</div>
                             </div>
                             <div>
                                 <div className="text-4xl md:text-5xl font-extrabold mb-2">10k+</div>
                                 <div className="text-primary-foreground/80 font-medium">Happy Players</div>
                             </div>
                         </div>
                     </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-24 bg-background">
                    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                             {/* Decorative circles */}
                             <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                             <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
                             
                             <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Own a Sports Venue?</h2>
                             <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                                 Partner with FieldMax to streamline your bookings, increase revenue, and reach more players.
                             </p>
                             <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                 <Link href="/register">
                                     <Button size="lg" className="w-full sm:w-auto text-base bg-white text-slate-900 hover:bg-white/90">
                                         List Your Venue
                                     </Button>
                                 </Link>
                                 <Link href="/contact">
                                     <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/20 hover:bg-white/10 text-white">
                                         Contact Sales
                                     </Button>
                                 </Link>
                             </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
