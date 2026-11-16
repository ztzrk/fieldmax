import { api } from "@/lib/api";
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
        const response = await api.get<ApiResponse<RevenueStats>>(
            "/renter/revenue"
        );
        return response.data.data;
    },
    getPublicProfile: async (renterId: string) => {
        const response = await api.get(`/renter/public/${renterId}`);
        return response.data.data;
    },
    checkInBooking: async (code: string) => {
        const response = await api.post("/renter/bookings/check-in", { code });
        return response.data;
    },
};

export default RenterService;
