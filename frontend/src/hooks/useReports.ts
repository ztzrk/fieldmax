import {
    useQuery,
    keepPreviousData,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { reportsService } from "@/services/reports.service";

export function useGetAllReports(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
) {
    return useQuery({
        queryKey: ["reports", { page, limit, search, sortBy, sortOrder }],
        queryFn: async () => {
            const data = await reportsService.getAllReports({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
            });
            return data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useResolveReport() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reportsService.resolve(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
        },
    });
}
