"use client";

import { VenuesList } from "@/components/shared/pages/VenuesList";
import { columns } from "./components/columns";
import { CreateVenueButton } from "./components/CreateVenueButton";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";

/**
 * Admin Venues Page.
 * Displays a list of all venues.
 */
export default function VenuesAndFieldsPage() {
    return (
        <VenuesList<VenueResponseSchema>
            title="Venues"
            description="Manage all venues in the system."
            columns={columns}
            renderHeaderActions={<CreateVenueButton />}
        />
    );
}
