"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCreateUser } from "@/hooks/useUsers";
import { UserForm } from "./userForm";
import { UserFormValues } from "@/lib/schema/user.schema";

export function CreateUserButton() {
    const [isOpen, setIsOpen] = useState(false);

    const { mutate: createUser, isPending } = useCreateUser();

    const handleSubmit = async (data: UserFormValues) => {
        createUser(data, {
            onSuccess: () => {
                toast.success(`${data.fullName} created successfully`);
                setIsOpen(false);
            },
            onError: (error) => {
                toast.error(
                    `Failed to create ${data.fullName} error: ${error.message}`
                );
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <UserForm onSubmit={handleSubmit} isPending={isPending} />
            </DialogContent>
        </Dialog>
    );
}
