"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface InputFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
}

export function InputField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
}: InputFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            {...field}
                            value={
                                typeof field.value === "number" &&
                                field.value === 0
                                    ? ""
                                    : field.value ?? ""
                            }
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
