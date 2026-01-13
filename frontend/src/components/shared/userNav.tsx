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
import Link from "next/link";
import {
    User,
    LayoutDashboard,
    MapPin,
    Trophy,
    Calendar,
    MessageSquareWarning,
} from "lucide-react";

/**
 * UserNav Component
 *
 * User profile dropdown menu. Displays avatar/initials and provides links
 * to Profile, Dashboard (based on role), and Logout.
 */
export function UserNav() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const handleLogout = () => {
        logout();
    };

    const dashboardLink =
        user.role === "ADMIN" ? "/admin/dashboard" : "/renter/dashboard";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar className="h-8 w-8">
                        {user.profilePictureUrl ? (
                            <AvatarImage src={user.profilePictureUrl} />
                        ) : (
                            <AvatarFallback>
                                {user.fullName
                                    .split(" ")
                                    .map((name) => name.charAt(0))
                                    .join("")
                                    .toUpperCase()
                                    .substring(0, 2)}
                            </AvatarFallback>
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
                            <DropdownMenuItem asChild>
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/bookings">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Bookings</span>
                                </Link>
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem asChild>
                                <Link href={dashboardLink}>
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={
                                        user.role === "ADMIN"
                                            ? "/admin/venues"
                                            : "/renter/venues"
                                    }
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    <span>Venues</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={
                                        user.role === "ADMIN"
                                            ? "/admin/fields"
                                            : "/renter/fields"
                                    }
                                >
                                    <Trophy className="mr-2 h-4 w-4" />
                                    <span>Fields</span>
                                </Link>
                            </DropdownMenuItem>
                        </>
                    )}
                    <DropdownMenuItem asChild>
                        <Link
                            href={
                                user.role === "RENTER"
                                    ? "/renter/reports"
                                    : "/reports"
                            }
                        >
                            <MessageSquareWarning className="mr-2 h-4 w-4" />
                            <span>Support</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
