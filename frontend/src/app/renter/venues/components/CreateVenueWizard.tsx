"use client";

import { useState } from "react";
import { useCreateVenue, useUploadVenuePhotos } from "@/hooks/useVenues";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VenueForm } from "@/app/admin/venues/components/VenueForm";
import { ImageUploader } from "@/components/shared/form/ImageUploader";
import { Stepper } from "@/components/ui/stepper";

const steps = [
    { id: "Step 1", name: "Venue Details" },
    { id: "Step 2", name: "Upload Photos" },
    { id: "Step 3", name: "Add Fields" },
];

export function CreateVenueWizard() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [newVenue, setNewVenue] = useState<any>(null);

    const { mutateAsync: createVenue, isPending: isCreating } =
        useCreateVenue();
    const { mutateAsync: uploadPhotos, isPending: isUploading } =
        useUploadVenuePhotos(newVenue?.id);

    const handleVenueSubmit = async (values: any) => {
        const createdVenue = await createVenue(values);
        if (createdVenue) {
            setNewVenue(createdVenue);
            setCurrentStep(1);
        }
    };

    const handleUploadComplete = async () => {
        setCurrentStep(2);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create New Venue</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create a New Venue</DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                <div className="p-4 mt-4">
                    {currentStep === 0 && (
                        <VenueForm
                            onSubmit={handleVenueSubmit}
                            isPending={isCreating}
                        />
                    )}
                    {currentStep === 1 && newVenue && (
                        <div>
                            <h3 className="font-semibold mb-4">
                                Upload Photos for {newVenue.name}
                            </h3>
                            <ImageUploader
                                onUpload={uploadPhotos}
                                isUploading={isUploading}
                            />
                            <Button
                                onClick={handleUploadComplete}
                                className="w-full mt-4"
                            >
                                Next Step
                            </Button>
                        </div>
                    )}
                    {currentStep === 2 && newVenue && (
                        <div>
                            <h3 className="font-semibold mb-4">
                                Add Fields to {newVenue.name}
                            </h3>
                            {/* Di sini Anda bisa menaruh komponen untuk menambah Field */}
                            <p className="text-center text-muted-foreground p-8">
                                Field management coming soon.
                            </p>
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="w-full mt-4"
                            >
                                Finish
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
