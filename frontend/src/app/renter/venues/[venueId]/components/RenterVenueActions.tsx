"use client";

import { useResubmitVenue, useSubmitVenue } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

export function RenterVenueActions({
    venue,
}: {
    venue: {
        id: string;
        status: string;
        rejectionReason?: string | null;
        photos?: { id: string; url: string }[];
    };
}) {
    const { mutate: resubmitVenue } = useResubmitVenue(venue.id);
    const { mutate: submitVenue } = useSubmitVenue(venue.id);

    const photoCount = venue.photos?.length || 0;
    const isSubmittable = photoCount >= 2;

    if (venue.status === "DRAFT") {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span tabIndex={0}>
                            <ConfirmationDialog
                                trigger={
                                    <Button disabled={!isSubmittable}>
                                        Submit for Review
                                    </Button>
                                }
                                title="Submit Venue?"
                                description="Once submitted, you cannot edit it until it is reviewed by the admin."
                                onConfirm={() => submitVenue()}
                            />
                        </span>
                    </TooltipTrigger>
                    {!isSubmittable && (
                        <TooltipContent>
                            <p>Add at least 2 photos to submit.</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        );
    }

    if (venue.status === "REJECTED") {
        return (
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary" size="sm">
                            View Rejection Reason
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertCircle className="text-destructive" /> Venue Rejected
                            </DialogTitle>
                            <DialogDescription className="pt-4 text-foreground">
                                {venue.rejectionReason || "No reason provided."}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <ConfirmationDialog
                    trigger={
                        <Button size="sm">
                            Reapply (Resubmit)
                        </Button>
                    }
                    title="Resubmit Venue?"
                    description="This will change the status back to PENDING for admin review. Make sure you have addressed the rejection reason."
                    onConfirm={() => resubmitVenue()}
                />
            </div>
        );
    }

    return null;
}
