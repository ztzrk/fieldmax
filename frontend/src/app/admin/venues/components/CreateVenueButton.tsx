"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { VenueForm } from "./VenueForm";
import { useCreateVenue } from "@/hooks/useVenues";
import { VenueFormValues } from "@/lib/schema/venue.schema";

/**
 * Button component to trigger the "Create Venue" dialog.
 * Redirects to the edit page upon successful creation.
 */
export function CreateVenueButton() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { mutateAsync: createVenue, isPending } = useCreateVenue();

    const handleSubmit = async (values: VenueFormValues) => {
        try {
            const newVenue = await createVenue(values);
            if (newVenue) {
                setIsOpen(false);
                router.push(`/admin/venues/${newVenue.id}/edit`);
            }
        } catch (error) {}
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create Venue</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Venue</DialogTitle>
                </DialogHeader>
                <VenueForm onSubmit={handleSubmit} isPending={isPending} />
            </DialogContent>
        </Dialog>
    );
}
