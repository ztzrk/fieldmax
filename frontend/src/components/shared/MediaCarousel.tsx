"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { ReactNode } from "react";

interface Photo {
    id?: string;
    url: string;
}

interface MediaCarouselProps {
    photos: Photo[];
    alt: string;
    placeholderIcon: ReactNode;
    showGradient?: boolean;
    hoverControls?: boolean;
}

/**
 * MediaCarousel Component
 *
 * Reusable image carousel for detail pages (fields, venues).
 * Displays photos with navigation controls and placeholder for empty state.
 */
export function MediaCarousel({
    photos,
    alt,
    placeholderIcon,
    showGradient = false,
    hoverControls = false,
}: MediaCarouselProps) {
    const hasPhotos = photos && photos.length > 0;
    const hasMultiplePhotos = photos && photos.length > 1;

    return (
        <div
            className={`rounded-2xl overflow-hidden border bg-muted aspect-video relative shadow-sm ${
                hoverControls ? "group" : ""
            }`}
        >
            {hasPhotos ? (
                <Carousel className="w-full h-full">
                    <CarouselContent>
                        {photos.map((photo, index) => (
                            <CarouselItem key={photo.id || index}>
                                <div className="aspect-video w-full relative">
                                    <img
                                        src={photo.url}
                                        alt={alt}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    {showGradient && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {hasMultiplePhotos && (
                        <>
                            <CarouselPrevious
                                className={`left-4 ${
                                    hoverControls
                                        ? "opacity-0 group-hover:opacity-100 transition-opacity"
                                        : "bg-background/80 hover:bg-background"
                                }`}
                            />
                            <CarouselNext
                                className={`right-4 ${
                                    hoverControls
                                        ? "opacity-0 group-hover:opacity-100 transition-opacity"
                                        : "bg-background/80 hover:bg-background"
                                }`}
                            />
                        </>
                    )}
                </Carousel>
            ) : (
                <ImagePlaceholder
                    variant="pattern"
                    icon={placeholderIcon}
                    className="h-full w-full"
                />
            )}
        </div>
    );
}
