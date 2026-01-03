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
import { FieldCard } from "@/components/fields/FieldCard";
import { FieldResponseSchema } from "@/lib/schema/field.schema";

interface FeaturedFieldsProps {
    fields: FieldResponseSchema[];
}

/**
 * FeaturedFields Component
 *
 * Carousel section displaying featured fields.
 */
export function FeaturedFields({ fields }: FeaturedFieldsProps) {
    if (!fields || fields.length === 0) return null;

    return (
        <section className="w-full py-24 bg-background">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Top Rated Fields
                        </h2>
                        <p className="text-muted-foreground">
                            Book the highest-rated pitches recommended by
                            players like you.
                        </p>
                    </div>
                    <Link href="/fields">
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
                            {fields.map((field) => (
                                <CarouselItem
                                    key={field.id}
                                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5 2xl:basis-1/6"
                                >
                                    <FieldCard field={field} />
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
