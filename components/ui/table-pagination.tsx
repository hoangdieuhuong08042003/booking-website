"use client";

import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  showSelectedCount?: boolean;
  layout?: "left" | "right" | "between";
}

export function TablePagination<TData>({
  table,
  showSelectedCount = false,
  layout = "right",
}: TablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  const content = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        前へ
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        次へ
      </Button>
    </div>
  );

  if (layout === "left") {
    return <div className="flex items-center justify-start">{content}</div>;
  }

  if (layout === "between") {
    return (
      <div className="flex items-center justify-between">
        {showSelectedCount && (
          <div className="text-sm text-gray-600">
            {selectedCount} of {totalCount} 行選択済み
          </div>
        )}
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-end">{content}</div>;
}
