"use client";

import { useState } from "react";
import { SearchForm } from "../_components/search-form";
import { HotelList } from "../_components/hotel-list";
import type { Listing } from "@prisma/client"; // type-only import

export default function DashboardClient({
  initialListings,
}: {
  initialListings: Listing[]; // dùng Listing trực tiếp
}) {
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (formData: any) => {
    // temporary behavior: use server-provided initial listings as results
    setSearchResults(initialListings);
    setIsSearched(true);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <SearchForm onSearch={handleSearch} />
      <HotelList
        hotels={isSearched ? searchResults : initialListings}
        title={isSearched ? undefined : "Khách sạn nổi bật"}
      />
    </div>
  );
}
