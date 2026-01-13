import { useQuery } from "@tanstack/react-query";
import RenterService from "@/services/renter.service";

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
