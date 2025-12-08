"use client";

import { useApproveVenue } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import { RejectDialog } from "./RejectDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

export function VenueActions({
    venue,
}: {
    venue: {
        id: string;
        status: string;
        photos: {
            id: string;
            url: string;
            isFeatured: boolean;
        }[];
        rejectionReason?: string | null;
    };
}) {
    const { mutate: approveVenue } = useApproveVenue(venue.id);

    const photoCount = venue.photos?.length || 0;
    const isApprovable = photoCount >= 3;

    if (venue.status === "PENDING") {
        return (
            <div className="flex gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span tabIndex={0}>
                                <ConfirmationDialog
                                    trigger={
                                        <Button
                                            size="sm"
                                            disabled={!isApprovable}
                                        >
                                            Approve
                                        </Button>
                                    }
                                    title="Approve this venue?"
                                    description="This venue will become public and bookable."
                                    onConfirm={() => approveVenue()}
                                />
                            </span>
                        </TooltipTrigger>
                        {!isApprovable && (
                            <TooltipContent>
                                <p>Requires at least 3 photos to approve.</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
                <RejectDialog venueId={venue.id} />
            </div>
        );
    }

    if (venue.status === "REJECTED") {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                        View Rejection Reason
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle /> Venue Rejected
                        </DialogTitle>
                        <DialogDescription className="pt-4 text-foreground">
                            {venue.rejectionReason || "No reason provided."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return null;
}
