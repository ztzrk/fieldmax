import { useQuery, keepPreviousData } from "@tanstack/react-query";
import RenterService from "@/services/renter.service";

export const useGetPublicRenters = (
    page: number = 1,
    limit: number = 12,
    search?: string
) => {
    return useQuery({
        queryKey: ["public-renters", { page, limit, search }],
        queryFn: () => RenterService.getPublicRenters({ page, limit, search }),
        placeholderData: keepPreviousData,
    });
};

export const useGetPublicRenter = (renterId: string) => {
    return useQuery({
        queryKey: ["public-renter", renterId],
        queryFn: async () => {
            const data = await RenterService.getPublicProfile(renterId);
            return data;
        },
        enabled: !!renterId,
    });
};
