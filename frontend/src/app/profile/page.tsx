"use client";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your profile.</div>;
    }

    const initials = user.email.substring(0, 2).toUpperCase();

    return (
        <div className="container py-10 w-full max-w-3xl items-center justify-center mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">My Profile</h1>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{user.fullName || "User"}</CardTitle>
                        <p className="text-muted-foreground">{user.email}</p>
                        <p className="text-sm mt-1 capitalize badge badge-outline">{user.role}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <h3 className="font-medium">Account Details</h3>
                            <p className="text-sm text-muted-foreground">
                                Member since: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                            </p>
                        </div>
                        {/* Add more profile fields here */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
