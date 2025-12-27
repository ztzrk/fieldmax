"use client";

import { useGetProfile, useUploadProfilePicture } from "@/hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, MapPin, User as UserIcon, Phone, Camera } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditProfileDialog } from "./components/EditProfileDialog";
import { useRef } from "react";

export default function ProfilePage() {
    const { data: user, isLoading, isError } = useGetProfile();
    const { mutate: uploadPhoto, isPending: isUploading } = useUploadProfilePicture();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadPhoto(file);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-muted-foreground">Failed to load profile. Please make sure you are logged in.</p>
                <Link href="/login">
                    <Button>Go to Login</Button>
                </Link>
            </div>
        );
    }

    const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : user.email.substring(0, 2).toUpperCase();

    return (
        <div className="container py-10 w-full max-w-3xl mx-auto relative px-4 sm:px-6">
            <div className="flex items-center gap-4 mb-8 -ml-4 sm:-ml-12">
                <Link href="/">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-10 rounded-full hover:bg-accent"
                        title="Back to Home"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">My Profile</h1>
            </div>
            
            <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-8 bg-gradient-to-br from-primary/5 to-transparent relative">
                    <div className="absolute top-4 right-4">
                        <EditProfileDialog user={user} />
                    </div>
                    
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <Avatar className="h-24 w-24 border-4 border-background shadow-lg transition-opacity group-hover:opacity-80">
                            {user.profile?.profilePictureUrl && (
                                <AvatarImage src={user.profile.profilePictureUrl} alt={user.fullName} className="object-cover" />
                            )}
                            <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            {isUploading ? (
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                            ) : (
                                <Camera className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="text-center sm:text-left space-y-2">
                        <CardTitle className="text-3xl font-extrabold tracking-tight">{user.fullName}</CardTitle>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center sm:justify-start text-muted-foreground text-sm">
                            <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                                <UserIcon className="h-3.5 w-3.5" />
                                {user.role}
                            </span>
                            <span className="hidden sm:inline text-muted-foreground/30">•</span>
                            <span>{user.email}</span>
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-8 space-y-8">
                    {/* Bio Section */}
                    {user.profile?.bio && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                About Me
                            </h3>
                            <p className="text-muted-foreground leading-relaxed pl-3.5 border-l-2 border-muted italic">
                                "{user.profile.bio}"
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact & Location Info */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Information</h3>
                                <div className="space-y-3">
                                    {user.phoneNumber && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Phone Number</p>
                                                <p className="text-muted-foreground">{user.phoneNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                    {user.profile?.address && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Address</p>
                                                <p className="text-muted-foreground">{user.profile.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Details */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Account Details</h3>
                                <div className="p-4 rounded-lg bg-muted/30 border border-muted-foreground/10">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                                Active
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Member Since</span>
                                            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
