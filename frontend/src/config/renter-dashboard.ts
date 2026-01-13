import {
    LayoutDashboard,
    Building,
    FileText,
    List,
    DollarSign,
    MessageSquareWarning,
} from "lucide-react";

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
    {
        title: "Revenue",
        url: "/renter/revenue",
        icon: DollarSign,
    },
    {
        title: "Support",
        url: "/renter/reports",
        icon: MessageSquareWarning,
    },
];
