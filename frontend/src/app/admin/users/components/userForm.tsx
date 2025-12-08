"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserFormValues, userSchema } from "@/lib/schema/user.schema";
import { InputField } from "@/components/shared/form/InputField";
import { SelectField } from "@/components/shared/form/SelectField";
import { useCreateUser } from "@/hooks/useUsers";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface UserFormProps {
    initialData?: Partial<UserFormValues>;
    dialogClose: () => void;
}

export function UserForm({ initialData, dialogClose }: UserFormProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData || {
            fullName: "",
            email: "",
            password: "",
            phoneNumber: "",
            role: "USER",
        },
    });

    const { mutate: createUser, isPending } = useCreateUser();

    const handleSubmit = async (data: UserFormValues) => {
        createUser(data);
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
                <InputField
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="08123456789"
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
