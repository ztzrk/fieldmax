import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { ApiResponse } from "@fieldmax/shared";

export interface VenueRevenue {
    venueId: string;
    venueName: string;
    totalRevenue: number;
}

export interface FieldRevenue {
    fieldId: string;
    fieldName: string;
    venueName: string;
    totalRevenue: number;
}

export interface RevenueStats {
    totalRevenue: number;
    revenueByVenue: VenueRevenue[];
    revenueByField: FieldRevenue[];
}

const RenterService = {
    getRevenueStats: async () => {
        try {
            const response = await api.get<ApiResponse<RevenueStats>>(
                "/renter/revenue"
            );
            return response.data.data;
        } catch (error) {
            throw error as AxiosError;
        }
    },
};

export default RenterService;
