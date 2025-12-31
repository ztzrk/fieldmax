import { api } from "@/lib/api";

export const DashboardService = {
    async getAdminStats() {
        const response = await api.get("/dashboard/admin-stats");
        return response.data;
    },
    async getRenterStats() {
        const response = await api.get("/dashboard/renter-stats");
        return response.data;
    },
};
