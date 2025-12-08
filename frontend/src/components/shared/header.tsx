"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./userNav";

export function Header() {
    return (
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
