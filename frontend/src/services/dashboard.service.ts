import { api } from "@/lib/api";
import type { RecentBookingItem } from "@/components/dashboard/RecentBookings";
import type { RevenueChartPoint } from "@/components/dashboard/RevenueChart";

export interface AdminDashboardStatsResponse {
    stats: {
        totalUsers: number;
        rentersCount: number;
        regularUsersCount: number;
        newUsersThisMonth: number;
        userDeltaPct: number | null;
        totalVenues: number;
        approvedVenues: number;
        pendingVenues: number;
        totalFields: number;
        activeFields: number;
        pendingFields: number;
        openReports: number;
        totalBookings: number;
        todayBookingsCount: number;
        bookingsThisMonth: number;
        bookingDeltaPct: number | null;
        totalRevenue: number;
        monthlyRevenue: number;
        lastMonthRevenue: number;
        revenueDeltaPct: number | null;
        bookingStatusBreakdown: { status: string; count: number }[];
        topSportTypes: { id: string; name: string; fieldCount: number }[];
        recentBookings: RecentBookingItem[];
    };
    chartData: {
        "7d": RevenueChartPoint[];
        "30d": RevenueChartPoint[];
        "12m": RevenueChartPoint[];
    };
}

export interface RenterTodayScheduleItem {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    checkedInAt: string | null;
    user: {
        fullName: string;
        phoneNumber?: string | null;
    };
    field: {
        name: string;
        venue: {
            name: string;
        };
    };
}

export interface RenterTopFieldItem {
    id: string;
    name: string;
    venueId: string;
    venueName: string;
    isClosed: boolean;
    status: string;
    pricePerHour: number;
    bookingCount: number;
    revenue: number;
    avgRating: number;
    reviewCount: number;
}

export interface RenterDashboardStatsResponse {
    totalVenues: number;
    approvedVenues: number;
    pendingVenues: number;
    rejectedVenues: number;
    totalFields: number;
    activeFieldsCount: number;
    pendingFields: number;
    rejectedFields: number;
    openReports: number;
    totalBookings: number;
    bookingsThisMonth: number;
    bookingDeltaPct: number | null;
    recentBookings: RecentBookingItem[];
    totalRevenue: number;
    monthlyRevenue: number;
    lastMonthRevenue: number;
    revenueDeltaPct: number | null;
    averageRating: number;
    totalReviews: number;
    todayBookingsCount: number;
    checkedInTodayCount: number;
    todaySchedule: RenterTodayScheduleItem[];
    topFields: RenterTopFieldItem[];
}

export const DashboardService = {
    async getAdminStats(): Promise<AdminDashboardStatsResponse> {
        const response = await api.get("/dashboard/admin-stats");
        return response.data.data;
    },
    async getRenterStats(): Promise<RenterDashboardStatsResponse> {
        const response = await api.get("/dashboard/renter-stats");
        return response.data.data;
    },
    async getChartData(range: string): Promise<RevenueChartPoint[]> {
        const response = await api.get(`/dashboard/chart-data?range=${range}`);
        return response.data.data;
    },
};
