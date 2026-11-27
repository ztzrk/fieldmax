"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";
import type { ActiveFilterChip } from "@/components/shared/DataTable";
import type { FacetedFilterOption } from "@/components/shared/DataTableFacetedFilter";

interface UseTableQueryStateOptions<F extends string> {
    defaultPageSize?: number;
    filterKeys?: readonly F[];
    debounceMs?: number;
}

const parseCsvParam = (raw: string | null): string[] => {
    if (!raw) return [];
    return raw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
};

/**
 * Synchronizes DataTable pagination, sorting, search, and multi-select filters
 * with URL search params so views survive page reloads and back-navigation.
 */
export function useTableQueryState<F extends string = string>({
    defaultPageSize = 10,
    filterKeys = [] as readonly F[],
    debounceMs = 400,
}: UseTableQueryStateOptions<F> = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const urlSearch = searchParams.get("search") ?? "";
    const [searchInput, setSearchInput] = useState(urlSearch);
    const debouncedSearch = useDebounce(searchInput, debounceMs);
    const lastUrlSearchRef = useRef(urlSearch);

    // Keep local search input in sync if URL changes via back/forward or external reset
    useEffect(() => {
        if (urlSearch !== lastUrlSearchRef.current) {
            lastUrlSearchRef.current = urlSearch;
            setSearchInput(urlSearch);
        }
    }, [urlSearch]);

    const pagination = useMemo<PaginationState>(() => {
        const rawPage = Number(searchParams.get("page") || "1");
        const rawLimit = Number(searchParams.get("limit") || defaultPageSize);
        return {
            pageIndex: Number.isFinite(rawPage) && rawPage > 0 ? rawPage - 1 : 0,
            pageSize:
                Number.isFinite(rawLimit) && rawLimit > 0
                    ? rawLimit
                    : defaultPageSize,
        };
    }, [searchParams, defaultPageSize]);

    const sorting = useMemo<SortingState>(() => {
        const sortBy = searchParams.get("sortBy");
        const sortOrder = searchParams.get("sortOrder");
        if (!sortBy) return [];
        return [{ id: sortBy, desc: sortOrder === "desc" }];
    }, [searchParams]);

    const filters = useMemo(() => {
        const result = {} as Record<F, string[]>;
        for (const key of filterKeys) {
            result[key] = parseCsvParam(searchParams.get(key));
        }
        return result;
    }, [searchParams, filterKeys]);

    const updateParams = useCallback(
        (mutate: (params: URLSearchParams) => void) => {
            const next = new URLSearchParams(searchParams.toString());
            mutate(next);
            const qs = next.toString();
            const target = qs ? `${pathname}?${qs}` : pathname;
            router.replace(target, { scroll: false });
        },
        [pathname, router, searchParams]
    );

    // Push debounced search updates to URL and reset page to 1
    useEffect(() => {
        const normalized = debouncedSearch.trim();
        if (normalized === urlSearch) return;
        lastUrlSearchRef.current = normalized;
        updateParams((params) => {
            if (normalized) {
                params.set("search", normalized);
            } else {
                params.delete("search");
            }
            params.delete("page");
        });
    }, [debouncedSearch, urlSearch, updateParams]);

    const setPagination = useCallback(
        (next: PaginationState) => {
            updateParams((params) => {
                if (next.pageIndex > 0) {
                    params.set("page", String(next.pageIndex + 1));
                } else {
                    params.delete("page");
                }
                if (next.pageSize !== defaultPageSize) {
                    params.set("limit", String(next.pageSize));
                } else {
                    params.delete("limit");
                }
            });
        },
        [updateParams, defaultPageSize]
    );

    const setSorting = useCallback(
        (
            updater: SortingState | ((old: SortingState) => SortingState)
        ) => {
            const next =
                typeof updater === "function" ? updater(sorting) : updater;
            updateParams((params) => {
                if (next.length > 0) {
                    params.set("sortBy", next[0].id);
                    params.set("sortOrder", next[0].desc ? "desc" : "asc");
                } else {
                    params.delete("sortBy");
                    params.delete("sortOrder");
                }
                params.delete("page");
            });
        },
        [sorting, updateParams]
    );

    const setFilter = useCallback(
        (key: F, values: string[]) => {
            updateParams((params) => {
                if (values.length > 0) {
                    params.set(key, values.join(","));
                } else {
                    params.delete(key);
                }
                params.delete("page");
            });
        },
        [updateParams]
    );

    const resetAll = useCallback(() => {
        setSearchInput("");
        lastUrlSearchRef.current = "";
        updateParams((params) => {
            params.delete("search");
            params.delete("page");
            for (const key of filterKeys) {
                params.delete(key);
            }
        });
    }, [filterKeys, updateParams]);

    const buildChips = useCallback(
        (
            configs: Partial<
                Record<
                    F,
                    { label: string; options: FacetedFilterOption[] }
                >
            >
        ): ActiveFilterChip[] => {
            const chips: ActiveFilterChip[] = [];
            for (const key of filterKeys) {
                const cfg = configs[key];
                const activeValues = filters[key] || [];
                if (!cfg || activeValues.length === 0) continue;

                for (const val of activeValues) {
                    const optLabel =
                        cfg.options.find((o) => o.value === val)?.label || val;
                    chips.push({
                        key: `${key}:${val}`,
                        label: cfg.label,
                        valueLabel: optLabel,
                        onRemove: () =>
                            setFilter(
                                key,
                                activeValues.filter((item) => item !== val)
                            ),
                    });
                }
            }
            return chips;
        },
        [filterKeys, filters, setFilter]
    );

    const hasActiveFilters = useMemo(
        () => filterKeys.some((key) => (filters[key]?.length ?? 0) > 0),
        [filterKeys, filters]
    );

    return {
        pagination,
        setPagination,
        sorting,
        setSorting,
        searchInput,
        setSearchInput,
        debouncedSearch: urlSearch,
        filters,
        setFilter,
        resetAll,
        hasActiveFilters,
        buildChips,
    };
}
