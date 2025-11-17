"use client";

import * as React from "react";
import {
  flexRender,
  type Table as TanStackTable,
  type Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData> {
  table: TanStackTable<TData>;
  columns: { id?: string; accessorKey?: string }[];
  enableDragDrop?: boolean;
  onDragStart?: (index: number) => void;
  onDragOver?: (event: React.DragEvent<HTMLTableRowElement>) => void;
  onDrop?: (index: number) => void;
  getRowDataState?: (row: Row<TData>) => string | undefined;
}

export function DataTable<TData>({
  table,
  columns,
  enableDragDrop = false,
  onDragStart,
  onDragOver,
  onDrop,
  getRowDataState,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows?.length ? (
            rows.map((row, idx) => {
              const rowProps = enableDragDrop
                ? {
                    draggable: true,
                    onDragStart: onDragStart
                      ? () => onDragStart(idx)
                      : undefined,
                    onDragOver: onDragOver
                      ? (e: React.DragEvent<HTMLTableRowElement>) =>
                          onDragOver(e)
                      : undefined,
                    onDrop: onDrop ? () => onDrop(idx) : undefined,
                    "data-state": getRowDataState
                      ? getRowDataState(row)
                      : undefined,
                  }
                : {};

              return (
                <TableRow key={row.id} {...rowProps}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                結果がありません。
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
