"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextareaFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    description?: string;
    className?: string;
    required?: boolean;
}

/**
 * TextareaField Component
 *
 * Textarea input wrapper integrated with React Hook Form.
 * Handles label, error message, and description rendering.
 */
export function TextareaField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    description,
    className,
    required,
}: TextareaFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}{" "}
                        {required && (
                            <span className="text-destructive">*</span>
                        )}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            className={cn("resize-none", className)}
                            {...field}
                            value={field.value ?? ""}
                        />
                    </FormControl>
                    {description && (
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
