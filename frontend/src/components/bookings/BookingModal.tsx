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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useFieldAvailability, useCreateBooking } from "@/hooks/useBookings";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { FullScreenLoader } from "../FullScreenLoader";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface BookingModalProps {
    fieldId: string;
    fieldName: string;
    venueName: string;
    pricePerHour: number;
    trigger?: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}

export function BookingModal({
    fieldId,
    fieldName,
    venueName,
    pricePerHour,
    trigger,
    isOpen: controlledIsOpen,
    onClose,
}: BookingModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [duration, setDuration] = useState(1);
    const router = useRouter();

    const {
        data: availability,
        isLoading: isAvailabilityLoading,
        refetch,
    } = useFieldAvailability(fieldId, selectedDate);

    const { mutate: createBooking, isPending: isCreatingBooking } =
        useCreateBooking();

    const handleOpenChange = (open: boolean) => {
        if (controlledIsOpen !== undefined) {
            if (!open) onClose?.();
        } else {
            setIsOpen(open);
        }
    };

    const actualIsOpen =
        controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

    useEffect(() => {
        if (actualIsOpen) {
            refetch();
        }
    }, [actualIsOpen, selectedDate, refetch]);

    const { user } = useAuth();

    // ... existing hooks

    const handleBooking = () => {
        if (!selectedTime) return;

        if (user?.role !== "USER") {
            toast.error("Booking is restricted to Users only.");
            return;
        }

        createBooking(
            {
                fieldId,
                bookingDate: selectedDate,
                startTime: selectedTime,
                duration: duration,
            },
            {
                onSuccess: (response: { data: { snapToken: string } }) => {
                    const snapToken = response.data.snapToken;
                    if (snapToken) {
                        // @ts-ignore
                        window.snap.pay(snapToken, {
                            onSuccess: function (result: unknown) {
                                console.log("Payment success:", result);
                                router.push(`/bookings`);
                            },
                            onPending: function (result: unknown) {
                                console.log("Payment pending:", result);
                                router.push(`/bookings`);
                            },
                            onError: function (result: unknown) {
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

    const totalPrice = pricePerHour * duration;

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
                        <label className="text-sm font-medium">
                            Select Date
                        </label>
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
                        <label className="text-sm font-medium">
                            Duration (Hours)
                        </label>
                        <Select
                            value={duration.toString()}
                            onValueChange={(val) => setDuration(parseInt(val))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                    (h) => (
                                        <SelectItem
                                            key={h}
                                            value={h.toString()}
                                        >
                                            {h} Hour{h > 1 ? "s" : ""}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                            Available Start Time
                        </label>
                        {isAvailabilityLoading ? (
                            <FullScreenLoader />
                        ) : availability && availability.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2">
                                {availability
                                    .filter((startTime: string) => {
                                        // Filter logic: Check if we have 'duration' consecutive slots starting from this time
                                        const startHour = parseInt(
                                            startTime.split(":")[0]
                                        );

                                        // 2-hour buffer logic for "Today"
                                        const now = new Date();
                                        const isToday =
                                            selectedDate ===
                                            now.toISOString().split("T")[0];
                                        if (isToday) {
                                            const currentHour = now.getHours();
                                            if (startHour < currentHour + 2) {
                                                return false;
                                            }
                                        }

                                        for (let i = 0; i < duration; i++) {
                                            const checkHour = startHour + i;
                                            const checkTime = `${checkHour
                                                .toString()
                                                .padStart(2, "0")}:00`;
                                            if (
                                                !availability.includes(
                                                    checkTime
                                                )
                                            ) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    })
                                    .map((time: string) => (
                                        <Button
                                            key={time}
                                            variant={
                                                selectedTime === time
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            className="text-xs"
                                            onClick={() =>
                                                setSelectedTime(time)
                                            }
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

                    {selectedTime && (
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2 border">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">
                                    Price per hour
                                </span>
                                <span>{formatPrice(pricePerHour)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">
                                    Duration
                                </span>
                                <span>
                                    {duration} Hour{duration > 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between items-center font-bold">
                                <span>Total Price</span>
                                <span className="text-primary text-lg">
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!selectedTime || isCreatingBooking}
                        onClick={handleBooking}
                    >
                        {isCreatingBooking && <FullScreenLoader />}
                        Confirm Booking
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
