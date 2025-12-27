"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, LayoutDashboard, MapPin, Trophy } from "lucide-react";

export function UserNav() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const initials = user.email
        .substring(0, 2)
        .toUpperCase();

    const handleLogout = () => {
        logout();
    };

    const dashboardLink = user.role === "ADMIN" ? "/admin/dashboard" : "/renter/dashboard";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        {user.profilePictureUrl ? (
                            <AvatarImage src={user.profilePictureUrl} />
                        ) : (
                            <AvatarFallback>{initials}</AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.email.split("@")[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {user.role === "USER" ? (
                        <>
                            <DropdownMenuItem onClick={() => router.push("/profile")}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem onClick={() => router.push(dashboardLink)}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(user.role === "ADMIN" ? "/admin/venues" : "/renter/venues")}>
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>Venues</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(user.role === "ADMIN" ? "/admin/fields" : "/renter/fields")}>
                                <Trophy className="mr-2 h-4 w-4" />
                                <span>Fields</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
