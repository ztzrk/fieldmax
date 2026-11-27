"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface FilterOption {
    value: string;
    label: string;
}

interface SearchableFilterComboboxProps {
    options: FilterOption[];
    value?: string;
    onChange: (value?: string) => void;
    allLabel?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
}

/**
 * SearchableFilterCombobox
 *
 * Compact toolbar filter built with Popover + Command so long option lists
 * (e.g., dozens or hundreds of sport types) remain quick to search and browse.
 */
export function SearchableFilterCombobox({
    options,
    value,
    onChange,
    allLabel = "Semua",
    placeholder = "Pilih filter",
    searchPlaceholder = "Cari...",
    emptyText = "Data tidak ditemukan.",
    className,
}: SearchableFilterComboboxProps) {
    const [open, setOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "h-9 justify-between gap-2 px-3 font-normal",
                        selectedOption
                            ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary"
                            : "text-foreground",
                        className
                    )}
                >
                    <span className="truncate text-left">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                        {selectedOption && (
                            <span
                                role="button"
                                tabIndex={0}
                                aria-label={`Hapus filter ${placeholder}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(undefined);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onChange(undefined);
                                    }
                                }}
                                className="rounded-sm p-0.5 hover:bg-primary/15"
                            >
                                <X className="h-3.5 w-3.5" />
                            </span>
                        )}
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList className="max-h-60">
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="__ALL__"
                                onSelect={() => {
                                    onChange(undefined);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4 shrink-0",
                                        !value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span>{allLabel}</span>
                                <span className="ml-auto text-[11px] text-muted-foreground tabular-nums">
                                    {options.length}
                                </span>
                            </CommandItem>
                        </CommandGroup>
                        {options.length > 0 && <CommandSeparator />}
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                            onChange(
                                                isSelected
                                                    ? undefined
                                                    : option.value
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 shrink-0",
                                                isSelected
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span className="truncate">
                                            {option.label}
                                        </span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
