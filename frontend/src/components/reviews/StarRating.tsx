import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number; // 0 to 5
    maxRating?: number;
    size?: number;
    editable?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export function StarRating({
    rating,
    maxRating = 5,
    size = 20,
    editable = false,
    onRatingChange,
    className,
}: StarRatingProps) {
    const handleStarClick = (index: number) => {
        if (editable && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    return (
        <div className={cn("flex items-center", className)}>
            {[...Array(maxRating)].map((_, index) => (
                <Star
                    key={index}
                    size={size}
                    onClick={() => handleStarClick(index)}
                    className={cn(
                        "transition-colors",
                        index < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted-foreground/30",
                        editable ? "cursor-pointer hover:scale-110" : ""
                    )}
                />
            ))}
        </div>
    );
}
