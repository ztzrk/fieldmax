"use client";

import { useState } from "react";

import { Control, FieldValues, Path } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
}

/**
 * InputField Component
 *
 * Standard text input wrapper integrated with React Hook Form.
 * Handles label, error message, and description rendering.
 */
export function InputField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    required,
}: InputFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

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
                        <div className="relative">
                            <Input
                                type={
                                    type === "password" && showPassword
                                        ? "text"
                                        : type
                                }
                                placeholder={placeholder}
                                {...field}
                                value={
                                    typeof field.value === "number" &&
                                    field.value === 0
                                        ? ""
                                        : field.value ?? ""
                                }
                                className={type === "password" ? "pr-10" : ""}
                            />
                            {type === "password" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
