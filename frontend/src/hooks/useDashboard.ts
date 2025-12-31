import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
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
