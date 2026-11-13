import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
    reportsService,
    CreateReportData,
    CreateReplyData,
} from "@/services/reports.service";

export function useGetMyReports() {
    return useQuery({
        queryKey: queryKeys.reports.my(),
        queryFn: () => reportsService.getMyReports(),
    });
}

export function useGetAllReports(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: "asc" | "desc"
) {
    const params = { page, limit, search, sortBy, sortOrder };
    return useQuery({
        queryKey: queryKeys.reports.all(params),
        queryFn: () => reportsService.getAllReports(params),
    });
}

export function useGetReportById(id: string) {
    return useQuery({
        queryKey: queryKeys.reports.detail(id),
        queryFn: () => reportsService.getReportById(id),
        enabled: !!id,
    });
}

export function useCreateReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateReportData) => reportsService.createReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.reports._def });
        },
    });
}

export function useReplyReport(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateReplyData) =>
            reportsService.replyToReport(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.reports.detail(id),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.reports._def });
        },
    });
}

export function useResolveReport(defaultId?: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id?: string) => {
            const targetId = id || defaultId;
            if (!targetId) throw new Error("Report ID is required");
            return reportsService.resolve(targetId);
        },
        onSuccess: (_data, id) => {
            const targetId = id || defaultId;
            if (targetId) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.reports.detail(targetId),
                });
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.reports._def });
        },
    });
}
