import { ReviewResponseSchema } from "@/lib/schema/review.schema";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { StarRating } from "./StarRating";

interface ReviewListProps {
    reviews: ReviewResponseSchema[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    onPageChange: (page: number) => void;
    onRatingChange: (rating: number) => void;
    onClearFilter: () => void;
    selectedRatings: number[];
}

export function ReviewList({
    reviews,
    meta,
    onPageChange,
    onRatingChange,
    onClearFilter,
    selectedRatings,
}: ReviewListProps) {
    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
                <span className="text-sm font-medium mr-2">Filter by:</span>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <Button
                        key={rating}
                        variant={
                            selectedRatings.includes(rating)
                                ? "secondary"
                                : "outline"
                        }
                        size="sm"
                        onClick={() => onRatingChange(rating)}
                        className="gap-1 h-8"
                    >
                        {rating} <Star className="h-3 w-3 fill-current" />
                    </Button>
                ))}
                {selectedRatings.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilter}
                        className="text-muted-foreground h-8"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {selectedRatings.length > 0
                        ? "No reviews found with selected filters."
                        : "No reviews yet."}
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review: ReviewResponseSchema) => (
                        <div key={review.id} className="flex gap-4">
                            <Avatar>
                                <AvatarImage
                                    src={
                                        review.user.profile
                                            ?.profilePictureUrl || ""
                                    }
                                />
                                <AvatarFallback>
                                    {review.user.fullName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        {review.user.fullName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(review.createdAt),
                                            { addSuffix: true }
                                        )}
                                    </span>
                                </div>
                                <StarRating rating={review.rating} size={14} />
                                {review.comment && (
                                    <p className="text-sm text-foreground mt-1">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(1, meta.page - 1))}
                        disabled={meta.page === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground px-2">
                        Page {meta.page} of {meta.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onPageChange(
                                Math.min(meta.totalPages, meta.page + 1)
                            )
                        }
                        disabled={meta.page === meta.totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
