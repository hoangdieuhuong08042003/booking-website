"use client";

import type React from "react";
import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const ColumnNames: Record<string, string> = {
  id: "STT",
  category: "Danh mục",
  image: "Hình ảnh",
  name: "Tên",
  price: "Giá",
  description: "Mô tả",
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterPlaceholder?: string;
  addButtonText?: React.ReactNode;
  onAddClick?: () => void;
  onRowClick?: (row: TData) => void;
  filterOptions?: {
    id: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  totalPlans?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number) => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  filterState?: {
    selectedAmenity?: string | null;
    selectedRoomType?: string | null;
  };
  onFilterChange?: (columnId: string, value: string) => void;
  defaultColumnVisibility?: VisibilityState;
  columnNames?: Record<string, string>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterPlaceholder = "Tìm kiếm...",
  addButtonText,
  onRowClick,
  filterOptions = [],
  pageSize = 10,
  totalPlans = 0,
  pageIndex = 0,
  onPageChange,
  searchTerm = "",
  onSearchChange,
  filterState,
  onFilterChange,
  defaultColumnVisibility = {},
  columnNames = {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility
  );
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },
  });

  return (
    <div className="flex flex-col w-full h-fit rounded-md border bg-white p-6 gap-4 shadow-sm dark:bg-[#3A3A3A]">
      <div className="flex items-center justify-between ">
        <Input
          placeholder={filterPlaceholder}
          value={searchTerm}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="max-w-sm"
        />
        {addButtonText}
      </div>

      {filterOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filterOption) => {
            let activeFilter: string | undefined;
            if (filterOption.id === "amenity") {
              activeFilter = filterState?.selectedAmenity ?? undefined;
            } else if (filterOption.id === "roomType") {
              activeFilter = filterState?.selectedRoomType ?? undefined;
            } else {
              const column = table.getColumn(filterOption.id);
              activeFilter = column?.getFilterValue() as string | undefined;
            }

            return (
              <DropdownMenu key={filterOption.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={activeFilter ? "default" : "outline"}
                    className="flex h-9 items-center gap-1 px-3"
                  >
                    <span className="text-xs font-medium">
                      {filterOption.label}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-[160px] max-h-[300px] overflow-y-auto"
                >
                  {filterOption.options.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={activeFilter === option.value}
                      onCheckedChange={() =>
                        onFilterChange?.(filterOption.id, option.value)
                      }
                      className="text-sm"
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}

          {/* Columns visibility dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex h-9 items-center gap-1 px-3"
              >
                <span className="text-xs font-medium">Hiển thị cột</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[160px] max-h-[300px] overflow-y-auto"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-sm"
                    checked={column.getIsVisible()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      column.toggleVisibility(!column.getIsVisible());
                    }}
                  >
                    {ColumnNames[column.id] ??
                      columnNames[column.id] ??
                      column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active filters */}
          <div className="flex flex-wrap gap-2 items-center ml-2">
            {filterOptions.map((filterOption) => {
              let activeFilter: string | undefined;
              if (filterOption.id === "amenity") {
                activeFilter = filterState?.selectedAmenity ?? undefined;
              } else if (filterOption.id === "roomType") {
                activeFilter = filterState?.selectedRoomType ?? undefined;
              } else {
                const column = table.getColumn(filterOption.id);
                activeFilter = column?.getFilterValue() as string | undefined;
              }
              if (!activeFilter) return null;

              const activeOption = filterOption.options.find(
                (opt) => opt.value === activeFilter
              );

              return (
                <Badge
                  key={filterOption.id}
                  variant="secondary"
                  className="flex gap-1 items-center h-7 px-2 text-xs"
                >
                  <span className="font-medium">{filterOption.label}:</span>
                  {activeOption?.label || activeFilter}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 rounded-full hover:bg-muted"
                    onClick={() =>
                      onFilterChange?.(filterOption.id, activeFilter)
                    }
                  >
                    ×
                  </Button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/60">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 px-4 text-sm font-medium text-muted-foreground text-center"
                  >
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="p-4 align-middle text-sm"
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
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  Không có dữ liệu phù hợp.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4 mt-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            Trang <span className="font-medium mx-1">{pageIndex + 1}</span> /{" "}
            <span className="font-medium mx-1">
              {Math.max(1, Math.ceil(totalPlans / pageSize))}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onPageChange
                ? onPageChange(Math.max(pageIndex - 1, 0))
                : table.previousPage()
            }
            disabled={
              typeof onPageChange === "function"
                ? pageIndex === 0
                : !table.getCanPreviousPage()
            }
            className="h-8 px-3 text-sm"
          >
            <ChevronLeft className="size-4" />
            Trước
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onPageChange
                ? onPageChange(
                    Math.min(
                      pageIndex + 1,
                      Math.ceil(totalPlans / pageSize) - 1
                    )
                  )
                : table.nextPage()
            }
            disabled={
              typeof onPageChange === "function"
                ? pageIndex >= Math.ceil(totalPlans / pageSize) - 1
                : !table.getCanNextPage()
            }
            className="h-8 px-3 text-sm"
          >
            Tiếp
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
