"use client";

import { BookingsList } from "@/components/shared/pages/BookingsList";
import { columns } from "./components/columns";
import { BookingResponseSchema } from "@/lib/schema/booking.schema";

/**
 * Renter Bookings Page.
 * Displays a list of bookings for the renter's filtered view (handled by backend usually).
 */
export default function RenterBookingsPage() {
    return (
        <BookingsList<BookingResponseSchema>
            title="Bookings Management"
            description="View and manage bookings for your venues"
            columns={columns}
        />
    );
}
