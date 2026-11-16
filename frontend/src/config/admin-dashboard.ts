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
        title: "Pengguna",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Cabang Olahraga",
        url: "/admin/sport-types",
        icon: Swords,
    },
    {
        title: "Tempat Olahraga",
        url: "/admin/venues",
        icon: Building,
    },
    {
        title: "Lapangan",
        url: "/admin/fields",
        icon: Swords,
    },
    {
        title: "Pemesanan",
        url: "/admin/bookings",
        icon: FileText,
    },
    {
        title: "Laporan",
        url: "/admin/reports",
        icon: MessageSquareWarning,
    },
];
