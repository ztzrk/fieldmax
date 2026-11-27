"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageOff, Trash2 } from "lucide-react"; // Import ImageOff
import { useDeleteVenuePhoto } from "@/hooks/useVenues";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState } from "react";

type Photo = { id: string; url: string };

interface PhotoGalleryProps {
    photos: Photo[];
    venueId: string;
}

/**
 * Component for displaying and managing venue photos.
 * Allows admins to delete individual photos.
 */
export function PhotoGallery({ photos, venueId }: PhotoGalleryProps) {
    const { mutate: deletePhoto } = useDeleteVenuePhoto(venueId);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (photoId: string) => {
        setImageErrors((prevErrors) => ({ ...prevErrors, [photoId]: true }));
    };

    if (photos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12 px-4 rounded-xl border border-dashed border-border bg-muted/20">
                <ImageOff className="h-8 w-8 mb-2 opacity-60" />
                <p className="text-sm font-medium text-foreground">
                    Belum ada foto yang diunggah
                </p>
                <p className="text-xs mt-1">
                    Tambahkan foto tempat olahraga terbaik Anda di panel sebelah
                    kanan.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
                <div
                    key={photo.id}
                    className="relative group rounded-md overflow-hidden aspect-square"
                >
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="relative w-full h-full flex items-center justify-center bg-muted">
                                {imageErrors[photo.id] ? (
                                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                        <ImageOff className="h-1/3 w-1/3 text-gray-400" />
                                    </div>
                                ) : (
                                    <Image
                                        src={photo.url}
                                        alt="Venue Photo"
                                        fill
                                        loading="eager"
                                        unoptimized={true}
                                        className="object-cover cursor-pointer transition-transform group-hover:scale-105"
                                        onError={() =>
                                            handleImageError(photo.id)
                                        }
                                    />
                                )}
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
                            <VisuallyHidden>
                                <DialogTitle className="sr-only">
                                    Venue Photo Preview
                                </DialogTitle>
                            </VisuallyHidden>
                            {imageErrors[photo.id] ? (
                                <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-muted text-muted-foreground">
                                    <ImageOff className="h-24 w-24 text-gray-400" />
                                </div>
                            ) : (
                                <Image
                                    src={photo.url}
                                    alt="Venue Photo Preview"
                                    width={1200}
                                    height={800}
                                    unoptimized={true}
                                    className="w-full h-auto object-contain"
                                    onError={() => handleImageError(photo.id)}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    <div
                        className="absolute top-2 right-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ConfirmationDialog
                            trigger={
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    aria-label="Hapus foto"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            }
                            title="Hapus foto ini?"
                            description="Tindakan ini tidak dapat dibatalkan."
                            onConfirm={() => deletePhoto(photo.id)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
