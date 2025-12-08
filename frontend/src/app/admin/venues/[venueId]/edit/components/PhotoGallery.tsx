"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteVenuePhoto } from "@/hooks/useVenues";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Photo = { id: string; url: string };

interface PhotoGalleryProps {
    photos: Photo[];
    venueId: string;
}

export function PhotoGallery({ photos, venueId }: PhotoGalleryProps) {
    const { mutate: deletePhoto } = useDeleteVenuePhoto(venueId);

    if (photos.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                No photos uploaded yet.
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
                            <button className="w-full h-full">
                                <Image
                                    src={photo.url}
                                    alt="Venue Photo"
                                    fill
                                    className="object-cover cursor-pointer transition-transform group-hover:scale-105"
                                />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
                            <VisuallyHidden>
                                <DialogTitle className="sr-only">
                                    Venue Photo Preview
                                </DialogTitle>
                            </VisuallyHidden>
                            <Image
                                src={photo.url}
                                alt="Venue Photo Preview"
                                width={1200}
                                height={800}
                                className="w-full h-auto object-contain"
                            />
                        </DialogContent>
                    </Dialog>

                    <div
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ConfirmationDialog
                            trigger={
                                <Button variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            }
                            title="Delete this photo?"
                            description="This action cannot be undone."
                            onConfirm={() => deletePhoto(photo.id)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
