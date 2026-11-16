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

/**
 * Component for venue action buttons (Approve, Reject).
 * Displays tools based on venue status (e.g., Approve only if pending and has photos).
 */
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
                                            Setujui
                                        </Button>
                                    }
                                    title="Setujui venue ini?"
                                    description="Venue ini akan tampil publik dan dapat dipesan."
                                    onConfirm={() => approveVenue()}
                                />
                            </span>
                        </TooltipTrigger>
                        {!isApprovable && (
                            <TooltipContent>
                                <p>Memerlukan minimal 3 foto untuk disetujui.</p>
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
                        Lihat Alasan Penolakan
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle /> Venue Ditolak
                        </DialogTitle>
                        <DialogDescription className="pt-4 text-foreground">
                            {venue.rejectionReason || "Tidak ada alasan yang diberikan."}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return null;
}
