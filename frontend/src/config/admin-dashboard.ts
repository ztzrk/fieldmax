import {
    LayoutDashboard,
    Building,
    FileText,
    Users,
    Swords,
} from "lucide-react";

export type NavItem = {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
};

export const adminNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Sport Types",
        url: "/admin/sport-types",
        icon: Swords,
    },
    {
        title: "Venues",
        url: "/admin/venues",
        icon: Building,
    },
    {
        title: "Bookings",
        url: "/admin/bookings",
        icon: FileText,
    },
];
