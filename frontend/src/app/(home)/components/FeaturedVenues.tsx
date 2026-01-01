import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { VenueCard } from "@/components/venues/VenueCard";
import { VenuePublicSchema } from "@/lib/schema/venue.schema";

interface FeaturedVenuesProps {
    venues: VenuePublicSchema[];
}

/**
 * FeaturedVenues Component
 *
 * Carousel section displaying popular venues.
 */
export function FeaturedVenues({ venues }: FeaturedVenuesProps) {
    if (!venues || venues.length === 0) return null;

    return (
        <section className="w-full py-12 bg-muted/20">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Popular Venues
                    </h2>
                    <Link href="/venues">
                        <Button variant="ghost" className="gap-1">
                            See All <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="px-10">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {venues.map((venue) => (
                                <CarouselItem
                                    key={venue.id}
                                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5 2xl:basis-1/6"
                                >
                                    <VenueCard venue={venue} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
