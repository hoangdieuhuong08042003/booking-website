"use client";

import { useState } from "react";
import type { DayPlan } from "../dashboard/itinerary/types"; // add this import

// Params cho API tạo lịch trình
interface ItineraryParams {
  province: string;
  days: number;
  keywords: string[];
}

// Params cho API gợi ý địa điểm (recommend)
interface RecommendParams {
  province: string;
  keywords: string[];
  days?: number;           // optional, dùng để xem thời tiết
  num_places?: number;     // optional, 10-15
  consider_weather?: boolean; // optional
}

// Response types (tùy chỉnh theo thực tế response của bạn)
interface ItineraryResponse {
  tỉnh_thành: string;
  số_ngày: number;
  từ_khóa: string[];
  lịch_trình: DayPlan[]; // changed from any[] to DayPlan[]
  // ... các field khác
}

interface RecommendResponse {
  tỉnh_thành: string;
  từ_khóa: string[];
  số_lượng_gợi_ý: number;
  xem_xét_thời_tiết: boolean;
  thông_tin_thời_tiết: string; // thêm trường này nếu chưa có
  danh_sách_địa_điểm: Array<{
    tên: string;
    tỉnh: string;
    mô_tả: string;
    đánh_giá: number;
    hình_ảnh: string;
    hoạt_động: "Trong nhà" | "Ngoài trời";
    độ_phù_hợp_từ_khóa: number;
  }>;
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
        days?: number;
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