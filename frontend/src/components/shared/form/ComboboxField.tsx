"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

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
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    options: { value: string; label: string }[];
    disabled?: boolean;
    required?: boolean;
}

/**
 * ComboboxField Component
 *
 * Searchable select (combobox) component integrated with React Hook Form.
 * Built using Shadcn Command and Popover primitives.
 */
export function ComboboxField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    options,
    disabled,
    required,
}: ComboboxFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>
                        {label}{" "}
                        {required && (
                            <span className="text-destructive">*</span>
                        )}
                    </FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    disabled={disabled}
                                >
                                    {field.value
                                        ? options.find(
                                              (option) =>
                                                  option.value === field.value
                                          )?.label
                                        : placeholder || "Select option"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[--radix-popover-trigger-width] p-0"
                            align="start"
                        >
                            <Command>
                                <CommandInput
                                    placeholder={`Search ${label.toLowerCase()}...`}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        No {label.toLowerCase()} found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                value={option.label}
                                                key={option.value}
                                                onSelect={() => {
                                                    field.onChange(
                                                        option.value
                                                    );
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        option.value ===
                                                            field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
