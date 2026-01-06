"use client";

import { BookingsList } from "@/components/shared/pages/BookingsList";
import { columns } from "./components/columns";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";

/**
 * Admin Bookings Page.
 * Displays a list of all bookings across all venues.
 * Included details: User, Venue/Field, Date & Time, Status, and Payment info.
 */
export default function AdminBookingsPage() {
    return (
        <BookingsList<BookingResponseSchema>
            title="Bookings"
            description="Manage all venue reservations"
            columns={columns}
        />
    );
}
