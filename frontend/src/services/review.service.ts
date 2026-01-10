import { api } from "@/lib/api";
import {
    ReviewFormSchema,
    ReviewResponseSchema,
    reviewsPaginatedResponseSchema,
    ReviewsPaginatedResponseSchema,
} from "@/lib/schema/review.schema";

class ReviewService {
    async create(data: ReviewFormSchema): Promise<ReviewResponseSchema> {
        const response = await api.post("/reviews", data);
        return response.data.data;
    }

    async getByFieldId(
        fieldId: string,
        page = 1,
        limit = 5,
        ratings?: number[]
    ): Promise<ReviewsPaginatedResponseSchema> {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (ratings && ratings.length > 0) {
            ratings.forEach((r) => params.append("ratings", r.toString()));
        }

        const response = await api.get(
            `/reviews/fields/${fieldId}?${params.toString()}`
        );
        return reviewsPaginatedResponseSchema.parse(response.data);
    }
}

export default new ReviewService();
