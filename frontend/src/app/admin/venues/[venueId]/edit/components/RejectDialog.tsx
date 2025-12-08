"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRejectVenue } from "@/hooks/useVenues";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const rejectionSchema = z.object({
    rejectionReason: z
        .string()
        .min(10, { message: "Reason must be at least 10 characters." }),
});

export function RejectDialog({ venueId }: { venueId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: rejectVenue, isPending } = useRejectVenue(venueId);

    const form = useForm<z.infer<typeof rejectionSchema>>({
        resolver: zodResolver(rejectionSchema),
        defaultValues: { rejectionReason: "" },
    });

    function onSubmit(values: z.infer<typeof rejectionSchema>) {
        rejectVenue(values, {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            },
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    Reject
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject this venue?</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting this venue. The
                        renter will be notified.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="rejectionReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rejection Reason</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g., Photos are blurry, address is not clear..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Rejecting..."
                                    : "Confirm Rejection"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
