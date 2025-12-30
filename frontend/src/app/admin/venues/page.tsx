import { VenuesTable } from "./components/VenuesTable";

/**
 * Admin Venues and Fields Page.
 * Displays a list of all venues.
 * Note: The component name implies Fields as well, but the current UI only shows VenuesTable.
 */
export default function VenuesAndFieldsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Venues</h1>
                <p className="text-muted-foreground">
                    Manage all venues in the system.
                </p>
            </div>
            <VenuesTable />
        </div>
    );
}
