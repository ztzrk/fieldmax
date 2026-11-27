"use client";

import { Table } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>;
    columnLabels?: Record<string, string>;
}

/**
 * Column visibility switcher placed on the right side of the DataTable toolbar.
 */
export function DataTableViewOptions<TData>({
    table,
    columnLabels,
}: DataTableViewOptionsProps<TData>) {
    const columns = table
        .getAllColumns()
        .filter(
            (column) =>
                column.getCanHide() &&
                !["select", "index", "actions"].includes(column.id)
        );

    if (columns.length === 0) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5"
                >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Kolom</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => {
                    const metaLabel = (
                        column.columnDef.meta as { label?: string } | undefined
                    )?.label;
                    const headerLabel =
                        typeof column.columnDef.header === "string"
                            ? column.columnDef.header
                            : undefined;
                    const label =
                        columnLabels?.[column.id] ||
                        metaLabel ||
                        headerLabel ||
                        column.id;

                    return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                                column.toggleVisibility(Boolean(value))
                            }
                        >
                            {label}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
