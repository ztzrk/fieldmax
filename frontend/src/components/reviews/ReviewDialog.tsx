"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ReviewFormSchema, reviewFormSchema } from "@/lib/schema/review.schema";
import { useCreateReview } from "@/hooks/useReviews";
import { StarRating } from "./StarRating";

interface ReviewDialogProps {
    bookingId: string;
    isOpen: boolean;
    onClose: () => void;
    onReviewSubmitted?: () => void;
}

export function ReviewDialog({
    bookingId,
    isOpen,
    onClose,
    onReviewSubmitted,
}: ReviewDialogProps) {
    const form = useForm<ReviewFormSchema>({
        resolver: zodResolver(reviewFormSchema),
        defaultValues: {
            rating: 5,
            comment: "",
            bookingId: bookingId,
        },
    });

    const { mutate: submitReview, isPending } = useCreateReview();

    const onSubmit = (data: ReviewFormSchema) => {
        submitReview(
            { ...data, bookingId },
            {
                onSuccess: () => {
                    onReviewSubmitted?.();
                    onClose();
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with this field.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex justify-center py-2">
                                            <StarRating
                                                rating={field.value}
                                                editable
                                                size={32}
                                                onRatingChange={field.onChange}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comment (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us more about your experience..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
