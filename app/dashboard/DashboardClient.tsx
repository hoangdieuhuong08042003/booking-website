"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { HotelList } from "../_components/hotel-list";
import { getListingByFilter } from "../_actions/listing/listing-actions";
import { FilterSidebar, FilterData } from "../_components/filter";
import { Listing } from "@prisma/client";

export default function DashboardClient({
  initialListings,
}: {
  initialListings: Listing[];
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

  const [searchTriggered, setSearchTriggered] = useState(false);

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 12;

  // Query for listings with filters and pagination
  const { data: listingsData, isLoading } = useQuery({
    queryKey: [
      "listings",
      filters.location,
      filters.ward,
      filters.guests,
      filters.roomTypeId,
      filters.priceRange,
      filters.selectedAmenities,
      pageIndex,
      pageSize,
    ],
    queryFn: () =>
      getListingByFilter({
        provinceId: filters.location || undefined,
        wardId: filters.ward || undefined,
        guests: filters.guests || undefined,
        roomTypeId: filters.roomTypeId || undefined,
        priceRange: filters.priceRange,
        selectedAmenities:
          filters.selectedAmenities && filters.selectedAmenities.length > 0
            ? filters.selectedAmenities
            : undefined,
        pageIndex,
        pageSize,
      }),
    refetchOnWindowFocus: false,
    enabled: searchTriggered, // Only run the query if search has been triggered
  });

  // listingsData can be either array or { listings, total }
  const listings = Array.isArray(listingsData)
    ? listingsData
    : listingsData?.listings ?? initialListings;
  const totalHotels =
    typeof listingsData?.total === "number"
      ? listingsData.total
      : Array.isArray(listingsData)
      ? listingsData.length
      : initialListings.length;

  // Called when filter values change, but does NOT trigger search
  const handleFilterChange = (data: FilterData) => {
    setFilters(data);
  };

  // Called when search button in FilterSidebar is clicked
  const handleSearch = (data: FilterData) => {
    setFilters(data);
    setSearchTriggered(true);
    setPageIndex(0); // Reset to first page on new search
  };

  // Pagination handler
  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

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
            title={listings.length > 0 ? undefined : "Khách sạn nổi bật"}
            isLoading={isLoading}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            totalHotels={totalHotels}
          />
        </div>
      </div>
    </div>
  );
}
