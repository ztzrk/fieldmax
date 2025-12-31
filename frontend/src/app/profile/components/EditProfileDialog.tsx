"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "@/components/shared/form/InputField";
import { TextareaField } from "@/components/shared/form/TextareaField";
import { Form } from "@/components/ui/form";
import { useUpdateProfile } from "@/hooks/useProfile";
import { Pencil } from "lucide-react";
import { ProfileResponse } from "@/lib/schema/profile.schema";
import z from "zod";
import { FullScreenLoader } from "@/components/FullScreenLoader";

const profileFormSchema = z.object({
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    phoneNumber: z.string().optional().or(z.literal("")),
    bio: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileDialogProps {
    user: ProfileResponse;
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: user.fullName,
            phoneNumber: user.phoneNumber || "",
            bio: user.profile?.bio || "",
            address: user.profile?.address || "",
        },
    });

    function onSubmit(data: ProfileFormValues) {
        // Clean up empty strings to undefined or null if backend prefers,
        // but current backend handles strings fine.
        // We'll pass them as is.
        updateProfile(data, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <InputField
                            control={form.control}
                            name="fullName"
                            label="Full Name"
                            placeholder="John Doe"
                            required
                        />
                        <InputField
                            control={form.control}
                            name="phoneNumber"
                            label="Phone Number"
                            placeholder="+1 234 567 890"
                        />
                        <TextareaField
                            control={form.control}
                            name="bio"
                            label="Bio"
                            placeholder="Tell us a little bit about yourself"
                        />
                        <InputField
                            control={form.control}
                            name="address"
                            label="Address"
                            placeholder="123 Main St, City, Country"
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <FullScreenLoader />}
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
