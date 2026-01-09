"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllFields } from "@/hooks/useFields";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useGetAllSportTypesWithoutPagination } from "@/hooks/useSportTypes";
import { useDebounce } from "@/hooks/useDebounce";

import { FieldCard } from "@/components/fields/FieldCard";
import { FieldResponseSchema } from "@/lib/schema/field.schema";
import { FullScreenLoader } from "@/components/FullScreenLoader";

/**
 * FieldsPage Component
 *
 * Public listing of all fields. Supports searching by name and filtering by sport type.
 * Displays results in a responsive grid of FieldCards.
 */
export default function FieldsPage() {
    const searchParams = useSearchParams();
    const initialSportType = searchParams.get("sport");

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [selectedSportType, setSelectedSportType] = useState<
        string | undefined
    >(initialSportType || undefined);
    const [page, setPage] = useState(1);
    const pageSize = 24;

    const { data: sportTypes } = useGetAllSportTypesWithoutPagination();
    const router = useRouter();

    // Reset page when filters change
    // Removed useEffect as per request

    const { data: fieldsData, isLoading: isFieldsLoading } = useGetAllFields(
        page,
        pageSize,
        debouncedSearch.length > 0 ? debouncedSearch : "",
        "APPROVED",
        false,
        selectedSportType
    );

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const totalPages = fieldsData?.meta?.totalPages || 1;

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
                                placeholder="Search Fields..."
                                className="pl-8 w-full"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
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
                            onClick={() => {
                                setSelectedSportType(undefined);
                                setPage(1);
                                router.push(`/fields`);
                            }}
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
                                onClick={() => {
                                    setSelectedSportType(type.id);
                                    setPage(1);
                                    router.push(`/fields?sport=${type.id}`);
                                }}
                            >
                                {type.name}
                            </Button>
                        ))}
                    </div>
                </div>

                {isFieldsLoading ? (
                    <FullScreenLoader />
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                            {fieldsData?.data?.map(
                                (field: FieldResponseSchema) => (
                                    <FieldCard key={field.id} field={field} />
                                )
                            )}
                        </div>

                        {!isFieldsLoading && fieldsData?.data?.length === 0 && (
                            <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg">
                                <p className="text-xl">No fields found.</p>
                                <p className="text-sm mt-2">
                                    Try adjusting your filters.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(Math.max(1, page - 1))
                                    }
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground mx-2">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(
                                            Math.min(totalPages, page + 1)
                                        )
                                    }
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
