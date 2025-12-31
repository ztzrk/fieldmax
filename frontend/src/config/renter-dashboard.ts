import { LayoutDashboard, Building, FileText, List } from "lucide-react";

export type NavItem = {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
};

export const renterNavItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/renter/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Venues",
        url: "/renter/venues",
        icon: Building,
    },
    {
        title: "My Fields",
        url: "/renter/fields",
        icon: List,
    },
    {
        title: "Bookings",
        url: "/renter/bookings",
        icon: FileText,
    },
];
