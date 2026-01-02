"use client";

import {
    useGetProfile,
    useUploadProfilePicture,
    useUpdateProfile,
} from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    MapPin,
    User as UserIcon,
    Phone,
    Camera,
    Pencil,
    X,
    Save,
    Check,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRef, useState, useEffect } from "react";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ProfileFormSchema,
    profileFormSchema,
} from "@/lib/schema/profile.schema";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/InputField";
import { TextareaField } from "@/components/shared/form/TextareaField";

export default function ProfilePage() {
    const { data: user, isLoading, isError } = useGetProfile();
    const { mutate: uploadPhoto, isPending: isUploading } =
        useUploadProfilePicture();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            bio: "",
            address: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                fullName: user.fullName || "",
                phoneNumber: user.phoneNumber || "",
                bio: user.profile?.bio || "",
                address: user.profile?.address || "",
            });
        }
    }, [user, form]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadPhoto(file);
        }
    };

    const onSubmit = (data: ProfileFormSchema) => {
        updateProfile(data, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Cancel edit: reset form to current user values
            if (user) {
                form.reset({
                    fullName: user.fullName || "",
                    phoneNumber: user.phoneNumber || "",
                    bio: user.profile?.bio || "",
                    address: user.profile?.address || "",
                });
            }
        }
        setIsEditing(!isEditing);
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">
                    Failed to load profile. Please make sure you are logged in.
                </p>
                <Link href="/login">
                    <Button>Go to Login</Button>
                </Link>
            </div>
        );
    }

    const initials = user.fullName
        ? user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
        : user.email.substring(0, 2).toUpperCase();

    return (
        <div className="container py-10 w-full max-w-4xl mx-auto relative px-4 sm:px-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full hover:bg-accent"
                                    title="Back to Home"
                                    type="button"
                                >
                                    <ArrowLeft className="h-6 w-6" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold">My Profile</h1>
                        </div>

                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={toggleEdit}
                                        disabled={isUpdating}
                                    >
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                    <Button type="submit" disabled={isUpdating}>
                                        {isUpdating ? (
                                            <FullScreenLoader />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        Save Changes
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={toggleEdit}
                                    variant="outline"
                                    className="group"
                                >
                                    <Pencil className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                                    Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>

                    <Card className="border-none pt-0 shadow-lg overflow-hidden bg-card/80 backdrop-blur-sm">
                        <div className="relative h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                            {/* Cover area purely decorative for now */}
                        </div>

                        <div className="px-8 pb-8">
                            <div className="flex flex-col sm:flex-row items-end -mt-12 mb-6 gap-6">
                                <div className="relative group">
                                    <div
                                        className="relative cursor-pointer rounded-full p-1 bg-background shadow-xl"
                                        onClick={handleAvatarClick}
                                    >
                                        <Avatar className="h-32 w-32 border-4 border-background">
                                            {user.profile
                                                ?.profilePictureUrl && (
                                                <AvatarImage
                                                    src={
                                                        user.profile
                                                            .profilePictureUrl
                                                    }
                                                    alt={user.fullName}
                                                    className="object-cover"
                                                />
                                            )}
                                            <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-bold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Edit Badge */}
                                        <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors border-2 border-background">
                                            {isUploading ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            ) : (
                                                <Camera className="h-4 w-4" />
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="flex-1 space-y-1 mb-2">
                                    {isEditing ? (
                                        <div className="max-w-md">
                                            <InputField
                                                control={form.control}
                                                name="fullName"
                                                label=""
                                                placeholder="Your Full Name"
                                            />
                                        </div>
                                    ) : (
                                        <h2 className="text-3xl font-bold">
                                            {user.fullName}
                                        </h2>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/50">
                                            <UserIcon className="h-3.5 w-3.5" />
                                            <span className="capitalize">
                                                {user.role?.toLowerCase()}
                                            </span>
                                        </div>
                                        <span>{user.email}</span>
                                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Bio */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            About Me
                                        </h3>

                                        {isEditing ? (
                                            <TextareaField
                                                control={form.control}
                                                name="bio"
                                                label=""
                                                placeholder="Tell us a little bit about yourself..."
                                                className="min-h-[150px] resize-none"
                                            />
                                        ) : (
                                            <div className="bg-muted/30 rounded-lg p-6 border border-muted/50">
                                                {user.profile?.bio ? (
                                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                        {user.profile.bio}
                                                    </p>
                                                ) : (
                                                    <p className="text-muted-foreground/50 italic">
                                                        No bio yet. Click edit
                                                        to add one.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Details */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                            Contact Information
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <div className="mt-1 p-2 rounded-md bg-primary/10 text-primary h-fit">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="font-medium text-sm">
                                                        Phone Number
                                                    </p>
                                                    {isEditing ? (
                                                        <InputField
                                                            control={
                                                                form.control
                                                            }
                                                            name="phoneNumber"
                                                            label=""
                                                            placeholder="+1 234 567 890"
                                                        />
                                                    ) : (
                                                        <p className="text-muted-foreground text-sm">
                                                            {user.phoneNumber ||
                                                                "-"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="mt-1 p-2 rounded-md bg-primary/10 text-primary h-fit">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="font-medium text-sm">
                                                        Address
                                                    </p>
                                                    {isEditing ? (
                                                        <InputField
                                                            control={
                                                                form.control
                                                            }
                                                            name="address"
                                                            label=""
                                                            placeholder="123 Main St, City, Country"
                                                        />
                                                    ) : (
                                                        <p className="text-muted-foreground text-sm">
                                                            {user.profile
                                                                ?.address ||
                                                                "-"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                            Account Info
                                        </h3>
                                        <div className="flex justify-between text-sm py-2">
                                            <span className="text-muted-foreground">
                                                Member Since
                                            </span>
                                            <span className="font-medium">
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
