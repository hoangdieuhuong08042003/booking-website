"use client";

import { useState } from "react";
import type { Location } from "../dashboard/itinerary/types";

// Params cho API tạo lịch trình
interface ItineraryParams {
  province: string;
  days: string[]; // mảng ngày liên tiếp, tối đa 3 ngày, dạng ['dd/mm/yyyy', ...]
  keywords: string[];
}

// Params cho API gợi ý địa điểm (recommend)
interface RecommendParams {
  province: string;
  keywords: string[];
  days?: string[]; // mảng ngày liên tiếp, tối đa 3 ngày
  num_places?: number;     // optional, 10-15
  consider_weather?: boolean; // optional
}

// Response types (tùy chỉnh theo thực tế response của bạn)
export interface ItineraryDayResult {
  date: string;
  weather_forecast: string;
  plan: {
    "thời tiết": string;
    "sáng": Location ;
    "trưa": Location ;
    "chiều": Location ;
    "tối_ăn_uống": Location ;
    "tối": Location ;
  };
}

interface ItineraryResponse {
  daily_results: ItineraryDayResult[];
  message: string;
  tỉnh_thành?: string;
  số_ngày?: number;
  từ_khóa?: string[];
}

interface RecommendPlace {
  name: string;
  province: string;
  description: string;
  image: string;
  rating: number;
  "hoạt_động": string; // "ngoài trời" | "trong nhà"
}

interface RecommendResponse {
  weather_forecast: string[];
  results: RecommendPlace[];
  message: string;
}

export function useTourismApi() {
  // State cho lịch trình
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [itineraryError, setItineraryError] = useState<string | null>(null);

  // State cho gợi ý địa điểm
  const [recommendations, setRecommendations] = useState<RecommendResponse | null>(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  // Gọi API tạo lịch trình
  const fetchItinerary = async (params: ItineraryParams) => {
    setItineraryLoading(true);
    setItineraryError(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Không thể lấy lịch trình");
      }

      const json: ItineraryResponse = await res.json();
      setItinerary(json);
    } catch (e: unknown) {
      setItineraryError(
        e instanceof Error ? e.message : "Lỗi kết nối"
      );
    } finally {
      setItineraryLoading(false);
    }
  };

  // Gọi API gợi ý địa điểm
  const fetchRecommendations = async (params: RecommendParams) => {
    setRecommendLoading(true);
    setRecommendError(null);

    try {
      const body: {
        province: string;
        keywords: string[];
        days?: string[];
        num_places?: number;
        consider_weather?: boolean;
      } = {
        province: params.province,
        keywords: params.keywords,
      };

      if (params.days !== undefined) body.days = params.days;
      if (params.num_places !== undefined) body.num_places = params.num_places;
      if (params.consider_weather !== undefined) body.consider_weather = params.consider_weather;

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Không thể lấy gợi ý địa điểm");
      }

      const json: RecommendResponse = await res.json();
      setRecommendations(json);
    } catch (e: unknown) {
      setRecommendError(
        e instanceof Error ? e.message : "Lỗi kết nối"
      );
    } finally {
      setRecommendLoading(false);
    }
  };

  // Reset state nếu cần
  const resetItinerary = () => {
    setItinerary(null);
    setItineraryError(null);
  };

  const resetRecommendations = () => {
    setRecommendations(null);
    setRecommendError(null);
  };

  return {
    // Itinerary
    itinerary,
    itineraryLoading,
    itineraryError,
    fetchItinerary,
    resetItinerary,

    // Recommendations
    recommendations,
    recommendLoading,
    recommendError,
    fetchRecommendations,
    resetRecommendations,
  };
}