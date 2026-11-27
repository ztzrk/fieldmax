"use client";

import { Check, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface FacetedFilterOption {
    label: string;
    value: string;
}

interface DataTableFacetedFilterProps {
    title: string;
    options: FacetedFilterOption[];
    values: string[];
    onChange: (values: string[]) => void;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyText?: string;
}

/**
 * Multi-select faceted filter modeled after the shadcn/ui Tasks pattern.
 * Keeps the popover open across selections so multiple options can be toggled together.
 */
export function DataTableFacetedFilter({
    title,
    options,
    values,
    onChange,
    searchable,
    searchPlaceholder,
    emptyText = "Opsi tidak ditemukan.",
}: DataTableFacetedFilterProps) {
    const selectedSet = new Set(values);
    const shouldSearch = searchable ?? options.length > 5;

    const handleToggle = (optionValue: string) => {
        const next = new Set(selectedSet);
        if (next.has(optionValue)) {
            next.delete(optionValue);
        } else {
            next.add(optionValue);
        }
        onChange(Array.from(next));
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-9 border-dashed gap-1.5 font-normal",
                        selectedSet.size > 0 &&
                            "border-primary/40 bg-primary/5 hover:bg-primary/10"
                    )}
                >
                    <PlusCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{title}</span>
                    {selectedSet.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-1 h-4"
                            />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1.5 font-normal lg:hidden tabular-nums"
                            >
                                {selectedSet.size}
                            </Badge>
                            <div className="hidden items-center gap-1 lg:flex">
                                {selectedSet.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1.5 font-normal tabular-nums"
                                    >
                                        {selectedSet.size} dipilih
                                    </Badge>
                                ) : (
                                    options
                                        .filter((opt) =>
                                            selectedSet.has(opt.value)
                                        )
                                        .map((opt) => (
                                            <Badge
                                                variant="secondary"
                                                key={opt.value}
                                                className="rounded-sm px-1.5 font-normal"
                                            >
                                                {opt.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[230px] p-0" align="start">
                <Command>
                    {shouldSearch && (
                        <CommandInput
                            placeholder={
                                searchPlaceholder ||
                                `Cari ${title.toLowerCase()}...`
                            }
                        />
                    )}
                    <CommandList className="max-h-64">
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedSet.has(
                                    option.value
                                );
                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() =>
                                            handleToggle(option.value)
                                        }
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className="h-3 w-3" />
                                        </div>
                                        <span className="truncate">
                                            {option.label}
                                        </span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedSet.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onChange([])}
                                        className="justify-center text-center text-xs text-muted-foreground"
                                    >
                                        Hapus pilihan
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
