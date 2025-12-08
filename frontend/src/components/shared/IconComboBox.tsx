"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { availableIcons, Icon } from "./IconMap";

interface IconComboboxProps {
    value?: string;
    onChange: (value: string) => void;
}

export function IconCombobox({ value, onChange }: IconComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <div className="flex items-center gap-2">
                        {value ? <Icon name={value} /> : null}
                        {value
                            ? availableIcons.find((icon) => icon === value)
                            : "Select icon..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search icon..." />
                    <CommandList>
                        <CommandEmpty>No icon found.</CommandEmpty>
                        <CommandGroup>
                            {availableIcons.map((iconName) => (
                                <CommandItem
                                    key={iconName}
                                    value={iconName}
                                    onSelect={(currentValue) => {
                                        onChange(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === iconName
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    <div className="flex items-center gap-2">
                                        <Icon name={iconName} />
                                        <span>{iconName}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
