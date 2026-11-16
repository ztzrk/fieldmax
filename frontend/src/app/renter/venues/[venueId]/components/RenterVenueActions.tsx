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

/**
 * Component for venue actions (Submit, View Rejection, Resubmit).
 * Displays appropriate buttons based on the venue status.
 */
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
    const isSubmittable = photoCount >= 3;

    if (venue.status === "DRAFT") {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span tabIndex={0}>
                            <ConfirmationDialog
                                trigger={
                                    <Button disabled={!isSubmittable}>
                                        Ajukan Peninjauan
                                    </Button>
                                }
                                title="Ajukan Venue?"
                                description="Setelah diajukan, Anda tidak dapat mengeditnya hingga ditinjau oleh admin."
                                onConfirm={() => submitVenue()}
                            />
                        </span>
                    </TooltipTrigger>
                    {!isSubmittable && (
                        <TooltipContent>
                            <p>Tambahkan minimal 3 foto untuk mengajukan.</p>
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
                            Lihat Alasan Penolakan
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertCircle className="text-destructive" /> Venue Ditolak
                            </DialogTitle>
                            <DialogDescription className="pt-4 text-foreground">
                                {venue.rejectionReason || "Tidak ada alasan yang diberikan."}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <ConfirmationDialog
                    trigger={
                        <Button size="sm">
                            Ajukan Ulang
                        </Button>
                    }
                    title="Ajukan Ulang Venue?"
                    description="Status akan berubah kembali menjadi PENDING untuk ditinjau admin. Pastikan Anda telah memperbaiki alasan penolakan."
                    onConfirm={() => resubmitVenue()}
                />
            </div>
        );
    }

    return null;
}
