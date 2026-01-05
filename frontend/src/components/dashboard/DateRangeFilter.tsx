"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DateRangeFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="12m">Last 12 Months</SelectItem>
            </SelectContent>
        </Select>
    );
}
