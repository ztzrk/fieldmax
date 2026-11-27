import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import RenterService, { type RevenuePeriod } from "@/services/renter.service";
import { queryKeys } from "@/lib/queryKeys";

export const useAdminStats = () => {
    return useQuery({
        queryKey: queryKeys.dashboard.adminStats(),
        queryFn: DashboardService.getAdminStats,
    });
};

export const useRenterStats = () => {
    return useQuery({
        queryKey: queryKeys.dashboard.renterStats(),
        queryFn: DashboardService.getRenterStats,
    });
};

export const useRenterRevenue = (params?: {
    period?: RevenuePeriod;
    venueId?: string;
}) => {
    return useQuery({
        queryKey: queryKeys.dashboard.revenue(params),
        queryFn: () => RenterService.getRevenueStats(params),
        placeholderData: keepPreviousData,
    });
};

export const useChartData = (range: string) => {
    return useQuery({
        queryKey: ["dashboard-chart", range],
        queryFn: () => DashboardService.getChartData(range),
    });
};
