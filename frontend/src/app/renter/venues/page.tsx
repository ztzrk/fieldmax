"use client";

import { VenuesList } from "@/components/shared/pages/VenuesList";
import { columns } from "./components/column";
import { CreateVenueWizard } from "./components/CreateVenueWizard";
import { VenueResponseSchema } from "@/lib/schema/venue.schema";

/**
 * Renter Venues Page.
 * Displays a list of venues owned by the renter.
 */
export default function RenterVenuesPage() {
    return (
        <VenuesList<VenueResponseSchema>
            title="My Venues"
            description="Manage all your venues and their fields."
            columns={columns}
            renderHeaderActions={<CreateVenueWizard />}
        />
    );
}
