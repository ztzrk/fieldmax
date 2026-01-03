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
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

    // Calculate max duration based on selected time
    const maxDuration =
        selectedTime && availability
            ? (() => {
                  const startHour = parseInt(selectedTime.split(":")[0]);
                  let count = 0;
                  // Check consecutive hours availability
                  for (let i = 0; i < 24; i++) {
                      const checkHour = startHour + i;
                      if (checkHour >= 24) break; // End of day constraint logic if needed, but standard is availability check
                      const checkTime = `${checkHour
                          .toString()
                          .padStart(2, "0")}:00`;
                      if (availability.includes(checkTime)) {
                          count++;
                      } else {
                          break;
                      }
                  }
                  // Cap at 12 hours max per booking if desired, or let it be flexible
                  return Math.min(count, 12);
              })()
            : 12;

    // Adjust duration if it exceeds maxDuration
    useEffect(() => {
        if (duration > maxDuration) {
            setDuration(maxDuration);
        }
    }, [maxDuration, duration]);

    const { user } = useAuth();

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
                                router.push(`/bookings`);
                            },
                            onPending: function (result: unknown) {
                                router.push(`/bookings`);
                            },
                            onError: function (result: unknown) {
                                toast.error("Payment failed");
                            },
                            onClose: function () {
                                toast.error("Payment closed");
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
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl transition-all duration-300 border-none shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-border/10 bg-muted/20">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-light tracking-tight">
                            Book{" "}
                            <span className="font-semibold text-primary">
                                {fieldName}
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground/80">
                            {venueName}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-8">
                    {/* Controls Row */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Date
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-11 justify-start text-left font-normal rounded-xl border-border/50 bg-background/50 hover:bg-muted/30",
                                            !selectedDate &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? (
                                            format(
                                                new Date(selectedDate),
                                                "PPP"
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={
                                            selectedDate
                                                ? new Date(selectedDate)
                                                : undefined
                                        }
                                        onSelect={(date) => {
                                            if (date) {
                                                setSelectedDate(
                                                    format(date, "yyyy-MM-dd")
                                                );
                                                setSelectedTime(null);
                                            }
                                        }}
                                        disabled={(date) =>
                                            date <
                                            new Date(
                                                new Date().setHours(0, 0, 0, 0)
                                            )
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                                Duration
                            </label>
                            <Select
                                value={duration.toString()}
                                onValueChange={(val) =>
                                    setDuration(parseInt(val))
                                }
                            >
                                <SelectTrigger className="h-11 rounded-xl border-border/50 bg-background/50 hover:bg-muted/30 transition-all">
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from(
                                        { length: maxDuration },
                                        (_, i) => i + 1
                                    ).map((h) => (
                                        <SelectItem
                                            key={h}
                                            value={h.toString()}
                                        >
                                            {h} Hour{h > 1 ? "s" : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-3">
                        <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex justify-between">
                            <span>Available Slots</span>
                            {selectedTime && (
                                <span className="text-primary font-bold">
                                    {selectedTime}
                                </span>
                            )}
                        </label>

                        {isAvailabilityLoading ? (
                            <div className="h-32 flex items-center justify-center border rounded-xl border-dashed">
                                <FullScreenLoader />
                            </div>
                        ) : availability && availability.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
                                {availability
                                    .filter((startTime: string) => {
                                        const startHour = parseInt(
                                            startTime.split(":")[0]
                                        );
                                        // 2-hour buffer for today
                                        const now = new Date();
                                        const isToday =
                                            selectedDate ===
                                            now.toISOString().split("T")[0];
                                        if (
                                            isToday &&
                                            startHour < now.getHours() + 2
                                        )
                                            return false;

                                        // Consecutive slots check
                                        for (let i = 0; i < duration; i++) {
                                            const checkTime = `${(startHour + i)
                                                .toString()
                                                .padStart(2, "0")}:00`;
                                            if (
                                                !availability.includes(
                                                    checkTime
                                                )
                                            )
                                                return false;
                                        }
                                        return true;
                                    })
                                    .map((time: string) => (
                                        <button
                                            key={time}
                                            onClick={() =>
                                                setSelectedTime(time)
                                            }
                                            className={`
                                                relative group flex items-center justify-center py-2.5 text-sm rounded-lg transition-all duration-200 border
                                                ${
                                                    selectedTime === time
                                                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-105 font-medium"
                                                        : "bg-background hover:bg-muted border-border/40 hover:border-primary/30 text-muted-foreground hover:text-foreground"
                                                }
                                            `}
                                        >
                                            {time}
                                        </button>
                                    ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-xl text-muted-foreground/50 bg-muted/5">
                                <Clock className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-sm">No slots available</p>
                            </div>
                        )}
                    </div>

                    {/* Summary & Action */}
                    <div className="space-y-6 pt-2">
                        {selectedTime ? (
                            <div className="flex items-end justify-between p-4 bg-muted/20 border border-primary/10 rounded-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                                <div className="space-y-1 relative">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Total
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-foreground tracking-tight">
                                            {formatPrice(totalPrice)}
                                        </span>
                                        <span className="text-sm text-muted-foreground/80 font-medium">
                                            / {duration}h
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right relative">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {pricePerHour.toLocaleString()} / hr
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[88px] flex items-center justify-center text-muted-foreground/40 text-sm italic">
                                Select a time to calculate price
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="ghost"
                                onClick={() => handleOpenChange(false)}
                                className="h-12 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!selectedTime || isCreatingBooking}
                                onClick={handleBooking}
                                className="h-12 rounded-xl text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all"
                            >
                                {isCreatingBooking
                                    ? "Processing..."
                                    : "Confirm Booking"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
