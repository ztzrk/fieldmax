import {
    LayoutDashboard,
    Building,
    FileText,
    Users,
    Swords,
    MessageSquareWarning,
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
        title: "Fields",
        url: "/admin/fields",
        icon: Swords,
    },
    {
        title: "Bookings",
        url: "/admin/bookings",
        icon: FileText,
    },
    {
        title: "Reports",
        url: "/admin/reports",
        icon: MessageSquareWarning,
    },
];
