"use client";

import { columns } from "./components/columns";
import { DataTable } from "@/components/shared/DataTable";
import {
    useGetAllSportTypes,
    useDeleteMultipleSportTypes,
} from "@/hooks/useSportTypes";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import CreateSportTypeButton from "./components/CreateSportTypeButton";

export default function AdminSportTypesPage() {
    const { data: sportTypes, isLoading, isError } = useGetAllSportTypes();
    const { mutate: deleteMultiple, isPending: isDeleting } =
        useDeleteMultipleSportTypes();

    const handleDeleteSelected = async (selectedIds: string[]) => {
        deleteMultiple(selectedIds);
    };

    if (isLoading || isDeleting) return <FullScreenLoader />;
    if (isError) return <p className="text-red-500">Error loading data.</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Sport Types</h1>
                    <p className="text-muted-foreground">
                        Manage available sport types.
                    </p>
                </div>
                <CreateSportTypeButton />
            </div>
            <DataTable
                columns={columns}
                data={sportTypes || []}
                onDeleteSelected={handleDeleteSelected}
            />
        </div>
    );
}
