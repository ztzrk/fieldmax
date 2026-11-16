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
    ChevronDown,
    LogOut,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Admin",
    RENTER: "Pemilik Venue",
    USER: "Pengguna",
};

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

    const initials = user.fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);

    const firstName = user.fullName.split(" ")[0] || user.email.split("@")[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-9 rounded-full pl-1 pr-2.5 gap-2 border border-border/70 bg-background/70 hover:bg-muted/80"
                >
                    <Avatar className="h-7 w-7">
                        {user.profilePictureUrl ? (
                            <AvatarImage src={user.profilePictureUrl} />
                        ) : (
                            <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <span className="hidden sm:inline-block text-sm font-medium max-w-[110px] truncate">
                        {firstName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold leading-none truncate">
                                {user.fullName}
                            </p>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0">
                                {ROLE_LABELS[user.role] ?? user.role}
                            </span>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground truncate">
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
                                    <span>Profil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/bookings">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Pesanan Saya</span>
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
                                    <span>Tempat Olahraga</span>
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
                                    <span>Lapangan</span>
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
                            <span>Bantuan</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
