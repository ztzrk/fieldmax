"use client";

import { useRouter } from "next/navigation";
import { useGetAllFields } from "@/hooks/useFields";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { useDebounce } from "@/hooks/useDebounce";

import { FieldCard } from "@/components/fields/FieldCard";
import { FieldApiResponse } from "@/lib/schema/field.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";

/**
 * FieldsPage Component
 *
 * Public listing of all fields. Supports searching by name and filtering by sport type.
 * Displays results in a responsive grid of FieldCards.
 */
export default function FieldsPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [selectedSportType, setSelectedSportType] = useState<
        string | undefined
    >(undefined);

    const { user, isLoading: isAuthLoading } = useAuth();
    const { data: sportTypes } = useGetAllSportTypesWithoutPagination();
    const router = useRouter();

    const { data: fieldsData, isLoading: isFieldsLoading } = useGetAllFields(
        1,
        100,
        debouncedSearch.length > 0 ? debouncedSearch : "",
        "APPROVED",
        false,
        selectedSportType
    );

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {search
                                    ? `Fields matching "${search}"`
                                    : "All Fields"}
                            </h1>
                            <span className="text-muted-foreground text-sm">
                                {fieldsData?.meta?.total || 0} fields found
                            </span>
                        </div>
                        <div className="relative w-full md:w-72">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Filter fields..."
                                className="pl-8 w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant={
                                selectedSportType === undefined
                                    ? "default"
                                    : "outline"
                            }
                            size="sm"
                            className="rounded-full"
                            onClick={() => setSelectedSportType(undefined)}
                        >
                            All Sports
                        </Button>
                        {sportTypes?.map((type) => (
                            <Button
                                key={type.id}
                                variant={
                                    selectedSportType === type.id
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                className="rounded-full"
                                onClick={() => setSelectedSportType(type.id)}
                            >
                                {type.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {isFieldsLoading ? (
                    <FullScreenLoader />
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {fieldsData?.data?.map((field: FieldApiResponse) => (
                            <FieldCard key={field.id} field={field} />
                        ))}
                    </div>
                )}

                {!isFieldsLoading && fieldsData?.data?.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg">
                        <p className="text-xl">No fields found.</p>
                        <p className="text-sm mt-2">
                            Try adjusting your filters.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
