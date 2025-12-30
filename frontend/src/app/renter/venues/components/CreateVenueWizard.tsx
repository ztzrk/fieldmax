"use client";

import { useState } from "react";
import { useCreateVenue } from "@/hooks/useVenues";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VenueForm } from "@/app/admin/venues/components/VenueForm";
import { useRouter } from "next/navigation";
import { VenueFormValues } from "@/lib/schema/venue.schema";

/**
 * Wizard dialog for creating a new venue.
 * Wraps the VenueForm in a dialog component.
 */
export function CreateVenueWizard() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const { mutateAsync: createVenue, isPending: isCreating } =
        useCreateVenue();

    const handleVenueSubmit = async(values: VenueFormValues) => {
        await createVenue(values);
        setIsOpen(false);
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
                    <VenueForm
                        onSubmit={handleVenueSubmit}
                        isPending={isCreating}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
