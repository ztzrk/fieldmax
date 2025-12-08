"use client";

import { useGetAllVenues } from "@/hooks/useVenues";
import { CreateVenueWizard } from "./components/CreateVenueWizard";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { DataTable } from "@/components/shared/DataTable";
import { columns } from "./components/column";

export default function RenterVenuesPage() {
    const { data: venues, isLoading } = useGetAllVenues();
    if (isLoading) {
        return <FullScreenLoader />;
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">My Venues</h1>
                    <p className="text-muted-foreground">
                        Manage all your venues and their fields.
                    </p>
                </div>
                <CreateVenueWizard />
            </div>
            <DataTable columns={columns} data={venues || []} />
            <p className="text-center text-muted-foreground pt-10">
                Your venues table will be displayed here.
            </p>
        </div>
    );
}
