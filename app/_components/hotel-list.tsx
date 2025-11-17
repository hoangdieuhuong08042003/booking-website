"use client";

import { useState, useEffect } from "react";
import { HotelCard } from "./hotel-card";
import type { Listing } from "@prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

type ListingWithRelations = Listing & {
  province?: { id: number; name: string } | null;
  district?: { id: number; name: string } | null;
  thumbnail?: string | null;
};

interface HotelListProps {
  hotels: ListingWithRelations[]; // now accepts Prisma Listing objects (optionally with relations)
  title?: string;
  // pagination props (optional to preserve backward compatibility)
  pageIndex?: number;
  pageSize?: number;
  totalHotels?: number;
  onPageChange?: (pageIndex: number) => void;
  isLoading?: boolean;
}

export function HotelList({
  hotels,
  title,
  pageIndex = 0,
  pageSize = 6,
  totalHotels,
  onPageChange,
  isLoading = false,
}: HotelListProps) {
  const totalCount =
    typeof totalHotels === "number" ? totalHotels : hotels.length;
  const displayTitle = title || `Kết quả tìm kiếm (${totalCount} chỗ lưu trú)`;

  // internal pagination state (fallback when no onPageChange provided)
  const [internalPage, setInternalPage] = useState<number>(pageIndex);
  useEffect(() => setInternalPage(pageIndex), [pageIndex]);
  const currentPage =
    typeof onPageChange === "function" ? pageIndex : internalPage;

  // ensure we only show the hotels for the current page (max pageSize items)
  const start = currentPage * pageSize;
  const end = start + pageSize;
  const displayedHotels = hotels.slice(start, end);

  // If totalHotels provided use it, otherwise fall back to hotels.length.
  const effectiveTotal =
    typeof totalHotels === "number" ? totalHotels : hotels.length;
  // show pagination whenever there are more items than pageSize (works with or without onPageChange)
  const showPagination = effectiveTotal > pageSize;
  const pageCount = Math.max(1, Math.ceil(effectiveTotal / pageSize));

  // goTo will call external onPageChange if provided, otherwise update internal state
  const goTo = (index: number) => {
    if (typeof onPageChange === "function") {
      onPageChange(index);
    } else {
      setInternalPage(index);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-foreground mb-6">
        {displayTitle}
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: pageSize }).map((_, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              <div className="relative h-48 w-full bg-muted">
                {/* thêm bg-gray-200 cho skeleton (màu xám nhạt) */}
                <Skeleton className="h-full w-full bg-gray-200" />
              </div>

              <div className="p-4">
                {/* tiêu đề skeleton */}
                <Skeleton className="h-6 w-3/4 mb-3 bg-gray-200" />

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <Skeleton className="h-4 w-1/3 bg-gray-200" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-4 w-12 bg-gray-200" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-6 w-20 bg-gray-200" />
                  <Skeleton className="h-6 w-20 bg-gray-200" />
                </div>

                <div className="flex items-end justify-between">
                  <Skeleton className="h-5 w-24 bg-gray-200" />
                  <Skeleton className="h-9 w-28 bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedHotels.length === 0 ? (
        <div className="flex-1 text-center text-gray-500">
          Không có chỗ lưu trú
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedHotels.map((listing) => (
            <HotelCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Pagination: render when effectiveTotal > pageSize (supports internal or external paging) */}
      {showPagination && (
        <Pagination className="my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goTo(Math.max(currentPage - 1, 0))}
                aria-label="Trang trước"
                className={
                  currentPage === 0 ? "opacity-50 pointer-events-none" : ""
                }
              >
                Trước
              </PaginationPrevious>
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, index) => {
              const isCurrent = currentPage === index;
              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    className={isCurrent ? "bg-gray-200 dark:bg-white/6" : ""}
                    onClick={() => goTo(index)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => goTo(Math.min(currentPage + 1, pageCount - 1))}
                aria-label="Trang sau"
                className={
                  currentPage >= pageCount - 1
                    ? "opacity-50 pointer-events-none"
                    : ""
                }
              >
                Sau
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
