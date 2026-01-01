import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";
import { SportTypeResponseSchema } from "@/lib/schema/sportType.schema";

interface HomeData {
    sportTypes: SportTypeResponseSchema[];
    featuredFields: FieldResponseSchema[];
    featuredVenues: VenueResponseSchema[];
    statistics: {
        venueCount: number;
        fieldCount: number;
        playerCount: number;
    };
}

export const useGetHomeData = () => {
    return useQuery({
        queryKey: ["home-data"],
        queryFn: async (): Promise<HomeData> => {
            const { data } = await api.get<{ data: HomeData }>("/home");
            return data.data;
        },
    });
};
