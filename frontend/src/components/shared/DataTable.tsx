"use client";

import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    RowSelectionState,
    getPaginationRowModel,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
    RotateCcw,
    Search,
    X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SortableHeaderProps<TData, TValue> {
    column: Column<TData, TValue>;
    title: string;
    align?: "left" | "center" | "right";
}

/**
 * Shared sortable column header button with active directional indicator.
 */
export function SortableHeader<TData, TValue>({
    column,
    title,
    align = "left",
}: SortableHeaderProps<TData, TValue>) {
    const sorted = column.getIsSorted();

    return (
        <div
            className={cn(
                "flex",
                align === "right" && "justify-end",
                align === "center" && "justify-center"
            )}
        >
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting(sorted === "asc")}
                className={cn(
                    "h-8 px-2 font-medium hover:bg-muted/60",
                    align === "left" && "-ml-2",
                    align === "right" && "-mr-2",
                    sorted ? "text-foreground" : "text-muted-foreground"
                )}
            >
                <span>{title}</span>
                {sorted === "asc" ? (
                    <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-primary" />
                ) : sorted === "desc" ? (
                    <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-primary" />
                ) : (
                    <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-60" />
                )}
            </Button>
        </div>
    );
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDeleteSelected?: (selectedIds: string[]) => Promise<void>;
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: (pagination: PaginationState) => void;
    onSearch?: (value: string) => void;
    searchValue?: string;
    searchPlaceholder?: string;
    filters?: React.ReactNode;
    hasActiveFilters?: boolean;
    onResetFilters?: () => void;
    isFetching?: boolean;
}

/**
 * DataTable Component
 *
 * Reusable table component built on Tanstack Table.
 * Supports sorting, pagination, row selection, filters, and bulk deletion.
 */
export function DataTable<TData, TValue>({
    columns,
    data,
    onDeleteSelected,
    pageCount,
    pagination,
    onPaginationChange,
    onSearch,
    searchValue,
    searchPlaceholder = "Cari data...",
    filters,
    hasActiveFilters = false,
    onResetFilters,
    isFetching = false,
    sorting,
    onSortingChange,
}: DataTableProps<TData, TValue> & {
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
}) {
    const [internalSorting, setInternalSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: onSortingChange || setInternalSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        pageCount,
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function" ? updater(pagination) : updater;
            onPaginationChange(newPagination);
        },
        manualPagination: true,
        manualSorting: !!onSortingChange, // Enable manual sorting if onSortingChange is provided
        state: {
            sorting: onSortingChange ? sorting : internalSorting,
            rowSelection,
            pagination,
        },
    });

    const handleDelete = async () => {
        const selectedIds = table
            .getFilteredSelectedRowModel()
            .rows.map((row) => (row.original as { id: string }).id);

        if (onDeleteSelected) {
            await onDeleteSelected(selectedIds);
            table.resetRowSelection();
        }
    };

    const showResetButton =
        Boolean(onResetFilters) && (hasActiveFilters || Boolean(searchValue));

    return (
        <div className="w-full min-w-0">
            <div className="flex flex-col gap-3 pb-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                    {onSearch && (
                        <div className="relative w-full sm:w-64 lg:w-72">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={searchPlaceholder}
                                aria-label={searchPlaceholder}
                                className="h-9 pl-9 pr-8"
                                value={searchValue ?? ""}
                                onChange={(event) => onSearch(event.target.value)}
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => onSearch("")}
                                    aria-label="Bersihkan pencarian"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    )}
                    {filters && (
                        <div className="flex flex-wrap items-center gap-2">
                            {filters}
                        </div>
                    )}
                    {showResetButton && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onResetFilters}
                            className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isFetching && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Memperbarui...
                        </span>
                    )}
                    {onDeleteSelected && Object.keys(rowSelection).length > 0 && (
                        <ConfirmationDialog
                            trigger={
                                <Button variant="destructive" size="sm">
                                    Hapus {Object.keys(rowSelection).length}{" "}
                                    dipilih
                                </Button>
                            }
                            title={`Yakin ingin menghapus ${
                                Object.keys(rowSelection).length
                            } item?`}
                            description="Tindakan ini tidak dapat dibatalkan."
                            onConfirm={handleDelete}
                        />
                    )}
                </div>
            </div>
            <div
                className={cn(
                    "rounded-md border overflow-x-auto w-full max-w-[calc(100vw-4rem)] md:max-w-full transition-opacity duration-150",
                    isFetching && "opacity-65 pointer-events-none"
                )}
            >
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            width:
                                                header.getSize() !== 150
                                                    ? header.getSize()
                                                    : undefined,
                                        }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{
                                                width:
                                                    cell.column.getSize() !==
                                                    150
                                                        ? cell.column.getSize()
                                                        : undefined,
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <p className="text-sm">
                                            {hasActiveFilters || searchValue
                                                ? "Tidak ada data yang cocok dengan pencarian atau filter Anda."
                                                : "Belum ada data."}
                                        </p>
                                        {showResetButton && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={onResetFilters}
                                                className="h-8 gap-1.5"
                                            >
                                                <RotateCcw className="h-3.5 w-3.5" />
                                                Reset Filter
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between px-2 mt-4 gap-4">
                <div className="flex-1 text-sm text-muted-foreground text-center md:text-left">
                    {table.getFilteredSelectedRowModel().rows.length} dari{" "}
                    {table.getFilteredRowModel().rows.length} baris dipilih.
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Baris per halaman</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-auto">
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[130px] items-center justify-center text-sm font-medium tabular-nums">
                        Hal {table.getState().pagination.pageIndex + 1} dari{" "}
                        {Math.max(1, table.getPageCount())}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ke halaman pertama</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ke halaman sebelumnya</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ke halaman berikutnya</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ke halaman terakhir</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
