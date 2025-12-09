"use client";

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
  hotels: ListingWithRelations[];
  title?: string;
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
  pageSize = 12,
  totalHotels,
  onPageChange,
  isLoading = false,
}: HotelListProps) {
  const totalCount =
    typeof totalHotels === "number" ? totalHotels : hotels.length;
  const displayTitle = title || `Kết quả tìm kiếm (${totalCount} chỗ lưu trú)`;

  // ✅ Data is already paginated from server, just display
  const displayedHotels = hotels;

  const effectiveTotal =
    typeof totalHotels === "number" ? totalHotels : hotels.length;
  const showPagination = effectiveTotal > pageSize;
  const pageCount = Math.max(1, Math.ceil(effectiveTotal / pageSize));

  const handlePageChange = (newIndex: number) => {
    if (onPageChange) {
      onPageChange(newIndex);
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
                <Skeleton className="h-full w-full bg-gray-200" />
              </div>
              <div className="p-4">
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

      {showPagination && (
        <Pagination className="my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(pageIndex - 1, 0))}
                aria-label="Trang trước"
                className={
                  pageIndex === 0 ? "opacity-50 pointer-events-none" : ""
                }
              >
                Trước
              </PaginationPrevious>
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  className={
                    pageIndex === index ? "bg-gray-200 dark:bg-white/10" : ""
                  }
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(pageIndex + 1, pageCount - 1))
                }
                aria-label="Trang sau"
                className={
                  pageIndex >= pageCount - 1
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
