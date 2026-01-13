import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { queryKeys } from "@/lib/queryKeys";

export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: DashboardService.getAdminStats,
    });
};

export const useRenterStats = () => {
    return useQuery({
        queryKey: queryKeys.dashboard.renterStats(),
        queryFn: DashboardService.getRenterStats,
    });
};
export const useChartData = (range: string) => {
    return useQuery({
        queryKey: ["dashboard-chart", range],
        queryFn: () => DashboardService.getChartData(range),
    });
};
