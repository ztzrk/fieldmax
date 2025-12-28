"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { useFieldAvailability, useCreateBooking } from "@/hooks/useBookings";
import { useRouter } from "next/navigation";

interface BookingModalProps {
    fieldId: string;
    fieldName: string;
    venueName: string;
    trigger?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}

export function BookingModal({
    fieldId,
    fieldName,
    venueName,
    trigger,
    isOpen: controlledIsOpen,
    onClose,
}: BookingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const router = useRouter();

    const { data: availability, isLoading: isAvailabilityLoading, refetch } =
        useFieldAvailability(fieldId, selectedDate);

    const { mutate: createBooking, isPending: isCreatingBooking } =
        useCreateBooking();

    const handleOpenChange = (open: boolean) => {
        if (controlledIsOpen !== undefined) {
            if (!open) onClose?.();
        } else {
            setIsOpen(open);
        }
    };

    const actualIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

    useEffect(() => {
        if (actualIsOpen) {
            refetch();
        }
    }, [actualIsOpen, selectedDate, refetch]);

    const handleBooking = () => {
        if (!selectedTime) return;

        createBooking(
            {
                fieldId,
                bookingDate: selectedDate,
                startTime: selectedTime,
            },
            {
                onSuccess: (response: any) => {
                    const snapToken = response.data.snapToken;
                    if (snapToken) {
                        // @ts-ignore
                        window.snap.pay(snapToken, {
                            onSuccess: function (result: any) {
                                console.log("Payment success:", result);
                                router.push(`/profile/bookings`);
                            },
                            onPending: function (result: any) {
                                console.log("Payment pending:", result);
                                router.push(`/profile/bookings`);
                            },
                            onError: function (result: any) {
                                console.log("Payment error:", result);
                            },
                            onClose: function () {
                                console.log("Payment popup closed");
                            },
                        });
                    }
                },
            }
        );
    };

    return (
        <Dialog open={actualIsOpen} onOpenChange={handleOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book {fieldName}</DialogTitle>
                    <DialogDescription>
                        Select date and time for your booking at {venueName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Select Date</label>
                        <input
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime(null);
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Available Time Slots</label>
                        {isAvailabilityLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : availability && availability.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2">
                                {availability.map((time: string) => (
                                    <Button
                                        key={time}
                                        variant={selectedTime === time ? "default" : "outline"}
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        <Clock className="mr-1 h-3 w-3" />
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                No available slots for this date.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!selectedTime || isCreatingBooking}
                        onClick={handleBooking}
                    >
                        {isCreatingBooking && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm Booking
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
