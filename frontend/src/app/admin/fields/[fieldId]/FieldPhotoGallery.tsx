"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageOff, Trash2 } from "lucide-react";
import { useDeleteFieldPhoto } from "@/hooks/useFields";
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
    fieldId: string;
}

export function FieldPhotoGallery({ photos, fieldId }: PhotoGalleryProps) {
    const { mutate: deletePhoto } = useDeleteFieldPhoto(fieldId);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const handleImageError = (photoId: string) => {
        setImageErrors((prevErrors) => ({ ...prevErrors, [photoId]: true }));
    };

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
                            <button className="w-full h-full flex items-center justify-center bg-muted">
                                {imageErrors[photo.id] ? (
                                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                        <ImageOff className="h-1/3 w-1/3 text-gray-400" />
                                    </div>
                                ) : (
                                    <Image
                                        src={photo.url}
                                        alt="Field Photo"
                                        fill
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
                                    Field Photo Preview
                                </DialogTitle>
                            </VisuallyHidden>
                            {imageErrors[photo.id] ? (
                                <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-muted text-muted-foreground">
                                    <ImageOff className="h-24 w-24 text-gray-400" />
                                </div>
                            ) : (
                                <Image
                                    src={photo.url}
                                    alt="Field Photo Preview"
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
