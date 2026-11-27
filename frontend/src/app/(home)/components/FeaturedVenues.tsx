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
        <section className="w-full py-10 bg-muted/30">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Tempat Olahraga Terpopuler
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Tempat olahraga favorit dengan fasilitas lengkap dan
                            pengalaman bermain terbaik.
                        </p>
                    </div>
                    <Button variant="ghost" asChild className="gap-2 group">
                        <Link href="/venues">
                            Lihat Semua{" "}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
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
                                    <div className="h-full p-2">
                                        <VenueCard venue={venue} />
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
