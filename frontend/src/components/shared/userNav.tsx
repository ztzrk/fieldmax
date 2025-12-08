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
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

export function UserNav() {
    const { user, logout } = useAuth();
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={user?.profilePictureUrl ?? ""}
                            alt="User avatar"
                        />
                        <AvatarFallback>
                            {user?.fullName?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.fullName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem
                                    onClick={() => setTheme("light")}
                                >
                                    <Sun className="mr-2 h-4 w-4" />
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("dark")}
                                >
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setTheme("system")}
                                >
                                    <Monitor className="mr-2 h-4 w-4" />
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
