"use client";

import { useState } from "react";
import { SearchForm, type SearchFormData } from "../_components/search-form";
import { HotelList } from "../_components/hotel-list";
import type { Listing } from "@prisma/client"; // type-only import

export default function DashboardClient({
  initialListings,
}: {
  initialListings: Listing[]; // dùng Listing trực tiếp
}) {
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  // added loading state
  const [isLoading, setIsLoading] = useState(false);

  // replaced temporary handler with real API call, typed properly
  const handleSearch = async (formData: SearchFormData) => {
    setIsSearched(true);
    setIsLoading(true);

    try {
      const res = await fetch("/api/search-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Search request failed");
      }

      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <SearchForm onSearch={handleSearch} />
      <HotelList
        hotels={isSearched ? searchResults : initialListings}
        title={isSearched ? undefined : "Khách sạn nổi bật"}
        isLoading={isLoading}
      />
    </div>
  );
}
