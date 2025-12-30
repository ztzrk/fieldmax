"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { VenueFormValues } from "@/lib/schema/venue.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

/**
 * Sub-form component for managing venue operating hours.
 * Uses useFieldArray to handle weekly schedules dynamically.
 */
export function VenueScheduleForm() {
    const { control, watch, setValue } = useFormContext<VenueFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedules",
    });

    const schedules = watch("schedules") || [];

    const handleDayToggle = (dayIndex: number, isChecked: boolean) => {
        if (isChecked) {
            // Add default schedule for this day
            const existingIndex = schedules.findIndex((s) => s.dayOfWeek === dayIndex);
            if (existingIndex === -1) {
                append({
                    dayOfWeek: dayIndex,
                    openTime: "08:00",
                    closeTime: "22:00",
                });
            }
        } else {
            // Remove schedule for this day
            const indexToRemove = schedules.findIndex((s) => s.dayOfWeek === dayIndex);
            if (indexToRemove !== -1) {
                remove(indexToRemove);
            }
        }
    };

    return (
        <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium">Operating Hours</h3>
            <div className="space-y-2">
                {DAYS.map((dayName, dayIndex) => {
                    const scheduleIndex = schedules.findIndex(
                        (s) => s.dayOfWeek === dayIndex
                    );
                    const isOpen = scheduleIndex !== -1;

                    return (
                        <div key={dayIndex} className="flex items-center space-x-4">
                            <div className="w-32 flex items-center space-x-2">
                                <Checkbox
                                    checked={isOpen}
                                    onCheckedChange={(checked) =>
                                        handleDayToggle(dayIndex, checked as boolean)
                                    }
                                    id={`day-${dayIndex}`}
                                />
                                <Label htmlFor={`day-${dayIndex}`}>{dayName}</Label>
                            </div>

                            {isOpen && (
                                <div className="flex items-center space-x-2">
                                    <FormField
                                        control={control}
                                        name={`schedules.${scheduleIndex}.openTime`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <span>to</span>
                                    <FormField
                                        control={control}
                                        name={`schedules.${scheduleIndex}.closeTime`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                            {!isOpen && <span className="text-muted-foreground text-sm">Closed</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
