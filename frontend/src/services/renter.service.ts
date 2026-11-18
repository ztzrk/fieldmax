import { api } from "@/lib/api";
import { ApiResponse } from "@fieldmax/shared";

export interface VenueRevenue {
    venueId: string;
    venueName: string;
    fieldCount: number;
    bookingCount: number;
    totalRevenue: number;
}

export interface FieldRevenue {
    fieldId: string;
    fieldName: string;
    venueId: string;
    venueName: string;
    pricePerHour: number;
    isClosed: boolean;
    bookingCount: number;
    averageRating: number;
    reviewCount: number;
    totalRevenue: number;
}

export interface RevenueTransaction {
    id: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    status: string;
    checkedInAt: string | null;
    createdAt: string;
    user: {
        fullName: string;
        email: string;
    };
    payment?: {
        status: string;
        paymentMethod?: string | null;
    } | null;
    field: {
        id: string;
        name: string;
        venue: {
            id: string;
            name: string;
        };
    };
}

export interface RevenueStats {
    totalRevenue: number;
    monthlyRevenue: number;
    totalPaidBookings: number;
    averageOrderValue: number;
    revenueByVenue: VenueRevenue[];
    revenueByField: FieldRevenue[];
    transactions: RevenueTransaction[];
}

export interface PublicRenterItem {
    id: string;
    fullName: string;
    createdAt: string;
    profile?: {
        profilePictureUrl?: string | null;
        companyName?: string | null;
        companyDescription?: string | null;
        companyLogoUrl?: string | null;
        companyWebsite?: string | null;
        address?: string | null;
    } | null;
    _count?: {
        venues: number;
    };
}

const RenterService = {
    getRevenueStats: async () => {
        const response = await api.get<ApiResponse<RevenueStats>>(
            "/renter/revenue"
        );
        return response.data.data;
    },
    getPublicRenters: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
    }) => {
        const response = await api.get("/renter/public", { params });
        return response.data;
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
