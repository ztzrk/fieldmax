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
        <section className="w-full py-24 bg-muted/30">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Most Booked Venues
                        </h2>
                        <p className="text-muted-foreground">
                            Popular venues with a track record of great
                            experiences.
                        </p>
                    </div>
                    <Link href="/venues">
                        <Button variant="ghost" className="gap-2 group">
                            See All{" "}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                                    className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                >
                                    <div className="relative h-full p-2">
                                        <VenueCard venue={venue} />
                                        {venue.bookingCount !== undefined &&
                                            venue.bookingCount > 0 && (
                                                <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10 pointer-events-none">
                                                    {venue.bookingCount}{" "}
                                                    Bookings
                                                </div>
                                            )}
                                    </div>
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
