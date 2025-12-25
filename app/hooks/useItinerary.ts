"use client";

import { useState } from "react";
import { Itinerary } from "../dashboard/itinerary/types";

interface ItineraryParams {
  province: string;
  days: number;
  keywords: string[];
}

export function useItinerary() {
  const [data, setData] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItinerary = async (params: ItineraryParams) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error("API error");

      const json = await res.json();
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return {
    itinerary: data,
    loading,
    error,
    fetchItinerary,
  };
}
