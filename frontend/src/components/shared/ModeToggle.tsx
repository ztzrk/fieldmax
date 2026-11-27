"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ModeToggle Component
 *
 * Dropdown menu for switching between Light, Dark, and System display modes.
 */
export function ModeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Ubah tema tampilan"
                    className="h-11 w-11 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-border hover:border-primary/60 hover:bg-accent transition-colors duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all motion-reduce:transition-none dark:-rotate-90 dark:scale-0 text-primary" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all motion-reduce:transition-none dark:rotate-0 dark:scale-100 text-primary" />
                    <span className="sr-only">Ubah tema tampilan</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Terang
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Gelap
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    Sistem
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
