"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    RowSelectionState,
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
import { useState } from "react";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDeleteSelected?: (selectedIds: string[]) => Promise<void>;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onDeleteSelected,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        state: {
            sorting,
            rowSelection,
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

    return (
        <div>
            <div className="flex items-center py-4">
                {onDeleteSelected && Object.keys(rowSelection).length > 0 && (
                    <ConfirmationDialog
                        trigger={
                            <Button
                                variant="destructive"
                                size="sm"
                                className="mr-4"
                            >
                                Delete {Object.keys(rowSelection).length}{" "}
                                selected
                            </Button>
                        }
                        title={`Are you sure you want to delete ${
                            Object.keys(rowSelection).length
                        } item(s)?`}
                        description="This action cannot be undone."
                        onConfirm={handleDelete}
                    />
                )}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>
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
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
