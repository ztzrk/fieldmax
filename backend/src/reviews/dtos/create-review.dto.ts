export interface CreateReviewDto {
    bookingId: string;
    rating: number; // 1-5
    comment?: string;
}
