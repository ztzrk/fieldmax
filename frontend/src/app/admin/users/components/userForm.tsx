"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserFormValues, userSchema } from "@/lib/schema/user.schema";
import { InputField } from "@/components/shared/form/InputField";
import { SelectField } from "@/components/shared/form/SelectField";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { BackendErrorResponse } from "@/types/error";

interface UserFormProps {
    initialData?: Partial<UserFormValues> & { id?: string; createdAt?: string };
    dialogClose: () => void;
}

export function UserForm({ initialData, dialogClose }: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            role: "USER",
            ...initialData,
        },
    });

    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                password: "",
            });
        }
    }, [initialData, form]);

    const isPending = isCreating || isUpdating;

    const handleSubmit = async (data: UserFormValues) => {
        const mutationOptions = {
            onSuccess: () => {
                toast.success(
                    `${data.fullName} ${
                        initialData ? "updated" : "created"
                    } successfully`
                );
                dialogClose();
            },
            onError: (error: AxiosError<BackendErrorResponse>) => {
                if (error.response?.data?.errors) {
                    for (const fieldName in error.response.data.errors) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                userSchema.shape,
                                fieldName
                            )
                        ) {
                            form.setError(fieldName as keyof UserFormValues, {
                                message: error.response.data.errors[fieldName],
                            });
                        }
                    }
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else if (error.request) {
                    toast.error(
                        "Cannot connect to server. Please check your connection."
                    );
                } else {
                    toast.error(error.message);
                }
            },
        };

        if (initialData?.id) {
            updateUser(
                { userId: initialData.id, userData: data },
                mutationOptions
            );
        } else {
            createUser(data, mutationOptions);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
            >
                <InputField
                    control={form.control}
                    name="fullName"
                    label="Full Name"
                    placeholder="Budi Setiawan"
                />
                <InputField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="budi@example.com"
                    type="email"
                />
                <InputField
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="********"
                    type="password"
                />
                <SelectField
                    control={form.control}
                    name="role"
                    label="Role"
                    options={[
                        { value: "USER", label: "User" },
                        { value: "RENTER", label: "Renter" },
                        { value: "ADMIN", label: "Admin" },
                    ]}
                />
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </Form>
    );
}
