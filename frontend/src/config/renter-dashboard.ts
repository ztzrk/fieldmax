import {
    LayoutDashboard,
    Building,
    FileText,
    List,
    DollarSign,
    MessageSquareWarning,
    UserCog,
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
        title: "Tempat Olahraga Saya",
        url: "/renter/venues",
        icon: Building,
    },
    {
        title: "Lapangan Saya",
        url: "/renter/fields",
        icon: List,
    },
    {
        title: "Pemesanan",
        url: "/renter/bookings",
        icon: FileText,
    },
    {
        title: "Pendapatan",
        url: "/renter/revenue",
        icon: DollarSign,
    },
    {
        title: "Profil Mitra",
        url: "/renter/profile",
        icon: UserCog,
    },
    {
        title: "Bantuan",
        url: "/renter/reports",
        icon: MessageSquareWarning,
    },
];
