"use client";

import { Clock } from "lucide-react";

interface ScheduleItem {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
}

interface ScheduleDisplayProps {
    schedules: ScheduleItem[];
}

const DAYS = [
    { name: "Monday", value: 1 },
    { name: "Tuesday", value: 2 },
    { name: "Wednesday", value: 3 },
    { name: "Thursday", value: 4 },
    { name: "Friday", value: 5 },
    { name: "Saturday", value: 6 },
    { name: "Sunday", value: 0 },
];

export function ScheduleDisplay({ schedules }: ScheduleDisplayProps) {
    const formatTime = (isoString: string) => {
        try {
            if (!isoString || !isoString.includes("T")) return isoString;
            const date = new Date(isoString);
            const hours = date.getUTCHours().toString().padStart(2, "0");
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        } catch (e) {
            return isoString;
        }
    };

    if (!schedules || schedules.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic">
                No schedule set for this field.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {DAYS.map((day) => {
                const schedule = schedules.find((s) => s.dayOfWeek === day.value);
                return (
                    <div key={day.value} className="flex items-center justify-between text-sm py-1 border-b border-muted last:border-0">
                        <span className="font-medium">{day.name}</span>
                        {schedule ? (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                    {formatTime(schedule.openTime)} - {formatTime(schedule.closeTime)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-destructive font-medium uppercase text-[10px] tracking-wider">Closed</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
