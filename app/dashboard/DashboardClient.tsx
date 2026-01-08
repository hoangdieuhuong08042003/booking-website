"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { HotelList } from "../_components/hotel-list";
import { getListingByFilter } from "../_actions/listing/listing-actions";
import { FilterSidebar, FilterData } from "../_components/filter";
import { Listing } from "@prisma/client";

export default function DashboardClient({
  initialListings,
  totalInitial,
}: {
  initialListings: Listing[];
  totalInitial: number;
}) {
  const [filters, setFilters] = useState<FilterData>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    roomTypeId: "",
    priceRange: undefined,
    selectedAmenities: [],
  });

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 9;

  const handleFilterChange = (data: FilterData) => setFilters(data);

  const handleSearch = (data: FilterData) => {
    setFilters(data);
    setPageIndex(0);
  };

  const handlePageChange = (newPage: number) => setPageIndex(newPage);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["listings", filters, pageIndex],
    queryFn: () =>
      getListingByFilter({
        provinceId: filters.location || undefined,
        wardId: filters.ward || undefined,
        guests: filters.guests || undefined,
        roomTypeId: filters.roomTypeId || undefined,
        priceRange: filters.priceRange,
        selectedAmenities:
          filters.selectedAmenities?.length > 0
            ? filters.selectedAmenities
            : undefined,
        pageIndex,
        pageSize,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: true,
    placeholderData: (prevData) => prevData, // giữ data cũ khi fetching
  });
  const listings = data?.listings ?? initialListings;
  const totalHotels = data?.total ?? totalInitial;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
        <div className="flex-1">
          <HotelList
            hotels={listings}
            pageIndex={pageIndex}
            pageSize={pageSize}
            totalHotels={totalHotels}
            onPageChange={handlePageChange}
            isLoading={isLoading || isFetching}
            title={listings.length > 0 ? undefined : "Khách sạn nổi bật"}
          />
        </div>
      </div>
    </div>
  );
}
