export const queryKeys = {
    auth: {
        profile: () => ["profile-me"] as const,
    },
    sportTypes: {
        all: () => ["sport-types-all"] as const,
        list: (params: { page: number; limit: number; search?: string }) =>
            ["sport-types", params] as const,
        _def: ["sport-types"] as const,
    },
    venues: {
        list: (params: { page: number; limit: number; search?: string }) =>
            ["venues", params] as const,
        detail: (id: string) => ["venue", id] as const,
        publicList: () => ["public-venues"] as const,
        publicDetail: (id: string) => ["public-venue", id] as const,
        _def: ["venues"] as const,
    },
    fields: {
        list: (params: {
            page: number;
            limit: number;
            search?: string;
            status?: string;
            isClosed?: boolean;
            sportTypeId?: string;
        }) => ["fields", params] as const,
        detail: (
            id: string,
            page?: number,
            limit?: number,
            ratings?: number[] | undefined
        ) => ["field", id, { page, limit, ratings }] as const,
        _def: ["fields"] as const,
    },
    users: {
        all: () => ["users-all"] as const,
        list: (params: { page: number; limit: number; search?: string }) =>
            ["users", params] as const,
        _def: ["users"] as const,
    },
    bookings: {
        list: (params: { page: number; limit: number; search?: string }) =>
            ["bookings", params] as const,
        detail: (id: string) => ["booking", id] as const,
        availability: (fieldId: string, date: string) =>
            ["field-availability", fieldId, date] as const,
        _def: ["bookings"] as const,
    },
    dashboard: {
        adminStats: () => ["admin-stats"] as const,
        renterStats: () => ["renter-stats"] as const,
    },
    reviews: {
        byField: (
            fieldId: string,
            page: number,
            limit: number,
            ratings?: number[]
        ) => ["reviews", fieldId, { page, limit, ratings }] as const,
        _def: ["reviews"] as const,
    },
};
