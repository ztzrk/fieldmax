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
        <section className="w-full py-12 bg-background">
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Featured Fields
                    </h2>
                    <Link href="/fields">
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
