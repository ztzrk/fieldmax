
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";

export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: DashboardService.getAdminStats,
    });
};

export const useRenterStats = () => {
    return useQuery({
        queryKey: ["renter-stats"],
        queryFn: DashboardService.getRenterStats,
    });
};
