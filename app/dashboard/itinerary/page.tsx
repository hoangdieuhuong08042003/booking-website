"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TRIP_THEME_OPTIONS, TRAVEL_STYLE_OPTIONS } from "@/constants/keywords";
import {
  Sparkles,
  CloudRain,
  Sun,
  HelpCircle,
  Map,
  MapPin,
} from "lucide-react";
import InputCard from "./components/InputCard";
import KeywordGroup from "./components/KeywordGroup";
import ItineraryHeader from "./components/ItineraryHeader";
import DayCard from "./components/DayCard";
import RecommendCard, { type RecommendPlace } from "./components/RecommendCard";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import { useTourismApi } from "@/app/hooks/useItinerary";
import { WeatherForecast } from "./types";

export default function ItineraryPage() {
  const [province, setProvince] = useState("Huế");
  const [days, setDays] = useState<string[]>([]);
  const [primary, setPrimary] = useState<number | null>(0);
  const [attributes, setAttributes] = useState<number[]>([]);
  const [imgFallback, setImgFallback] = useState<Record<string, boolean>>({});
  // Tab state: "itinerary" | "recommend"
  const [activeTab, setActiveTab] = useState<"itinerary" | "recommend">(
    "itinerary"
  );

  const {
    itinerary,
    itineraryLoading,
    fetchItinerary,
    recommendLoading,
    fetchRecommendations,
    recommendations,
  } = useTourismApi();

  const selectedKeywords = [
    ...(primary !== null ? [TRIP_THEME_OPTIONS[primary].label] : []),
    ...attributes.map((idx) => TRAVEL_STYLE_OPTIONS[idx].label),
  ];

  // Chuẩn bị dữ liệu gợi ý địa điểm
  let recommendPlaces: RecommendPlace[] = [];
  if (recommendations) {
    if (
      Array.isArray(recommendations.results) &&
      recommendations.results.length > 0
    ) {
      recommendPlaces = recommendations.results;
    } else if (
      recommendations.results_by_intent &&
      typeof recommendations.results_by_intent === "object"
    ) {
      recommendPlaces = Object.values(recommendations.results_by_intent)
        .flat()
        .filter(Boolean) as RecommendPlace[];
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-b border-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Lập lịch trình thông minh
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Khám phá Việt Nam
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Tạo lịch trình du lịch hoàn hảo với AI, tùy chỉnh theo sở thích và
              phong cách của bạn
            </p>
          </motion.div>
        </div>
      </motion.div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <InputCard
              province={province}
              setProvince={setProvince}
              days={days}
              setDays={setDays}
              keywords={selectedKeywords}
              loading={itineraryLoading}
              fetchItinerary={fetchItinerary}
              fetchRecommendations={fetchRecommendations}
              recommendLoading={recommendLoading}
            />
          </motion.div>

          {/* Keywords Section */}
          <div className="lg:col-span-2 space-y-8">
            <KeywordGroup
              title="I. Chủ đề chuyến đi chính"
              items={TRIP_THEME_OPTIONS.map((opt) => opt.label)}
              selected={primary !== null ? [primary] : []}
              toggle={(idx: number) => setPrimary(idx === primary ? null : idx)}
              delay={0.3}
            />
            <KeywordGroup
              title="II. Hoạt động yêu thích"
              items={TRAVEL_STYLE_OPTIONS.map((opt) => opt.label)}
              selected={attributes}
              toggle={(idx: number) => {
                setAttributes((prev) =>
                  prev.includes(idx)
                    ? prev.filter((i) => i !== idx)
                    : prev.length < 2
                    ? [...prev, idx]
                    : prev
                );
              }}
              delay={0.4}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-7xl rounded-sm bg-card border border-border shadow-sm overflow-hidden flex">
            <button
              className={`w-full flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors ${
                activeTab === "itinerary"
                  ? "bg-primary text-white shadow"
                  : "text-foreground hover:bg-accent/30"
              }`}
              onClick={() => setActiveTab("itinerary")}
            >
              <Map className="w-5 h-5" />
              Lịch trình
            </button>
            <button
              className={`w-full flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors ${
                activeTab === "recommend"
                  ? "bg-primary text-white shadow"
                  : "text-foreground hover:bg-accent/30"
              }`}
              onClick={() => setActiveTab("recommend")}
            >
              <MapPin className="w-5 h-5" />
              Gợi ý địa điểm
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* Greeting/Intro section */}
          {!itinerary &&
            !recommendations &&
            !itineraryLoading &&
            !recommendLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 flex flex-col items-center justify-center gap-4 py-12 rounded-xl bg-card/70 shadow"
              >
                <Sparkles className="w-10 h-10 text-primary mb-2" />
                <h2 className="text-2xl font-bold text-foreground">
                  Chào mừng bạn đến với Trợ lý Lịch trình Du lịch!
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl text-center">
                  Hãy chọn tỉnh/thành, số ngày và sở thích của bạn, sau đó nhấn
                  nút tạo lịch trình hoặc gợi ý địa điểm để bắt đầu hành trình
                  khám phá Việt Nam cùng AI.
                </p>
              </motion.div>
            )}
          <AnimatePresence mode="wait">
            {activeTab === "itinerary" && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
              >
                {itineraryLoading ? (
                  <div className="flex justify-center items-center min-h-[200px]">
                    <span className="text-primary font-semibold text-lg">
                      Đang tải lịch trình...
                    </span>
                  </div>
                ) : itinerary && itinerary.daily_results?.length > 0 ? (
                  <div className="space-y-8">
                    <ItineraryHeader itinerary={itinerary} />
                    <div className="grid gap-8 md:grid-rows-1-2 lg:grid-rows-2">
                      {itinerary.daily_results?.map(
                        (dayResult, dayIndex: number) => (
                          <div
                            key={dayIndex}
                            className="rounded-2xl border border-border bg-card shadow-lg transition-all"
                          >
                            <DayCard
                              dayData={dayResult}
                              dayIndex={dayIndex}
                              imgFallback={imgFallback}
                              setImgFallback={setImgFallback}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : itinerary &&
                  (!itinerary.daily_results ||
                    itinerary.daily_results.length === 0) ? (
                  <div className="text-center text-destructive text-lg font-medium py-12 rounded-xl bg-card/60 shadow">
                    Không tìm thấy lịch trình phù hợp với lựa chọn của bạn. Vui
                    lòng thử lại với từ khóa hoặc tỉnh/thành khác.
                  </div>
                ) : null}
              </motion.div>
            )}

            {activeTab === "recommend" && (
              <motion.div
                key="recommend"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
              >
                {recommendLoading ? (
                  <div className="flex justify-center items-center min-h-[200px]">
                    <span className="text-primary font-semibold text-lg">
                      Đang tải gợi ý địa điểm...
                    </span>
                  </div>
                ) : recommendPlaces.length > 0 ? (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Gợi ý địa điểm nổi bật
                    </h2>
                    {/* Weather summary */}
                    {recommendations.weather_forecast && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-4">
                          {Array.isArray(recommendations.weather_forecast) ? (
                            recommendations.weather_forecast.map(
                              (w: WeatherForecast, idx: number) =>
                                typeof w === "object" && w !== null ? (
                                  <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.04 }}
                                    className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-accent/5 to-background px-4 py-3 shadow-md flex flex-col min-w-[220px] max-w-xs transition-all"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-primary">
                                        {w.date}
                                      </span>
                                      {w.status === "rain" ? (
                                        <CloudRain
                                          size={20}
                                          className="text-blue-500"
                                        />
                                      ) : w.status === "clear" ? (
                                        <Sun
                                          size={20}
                                          className="text-yellow-500"
                                        />
                                      ) : (
                                        <HelpCircle
                                          size={20}
                                          className="text-gray-400"
                                        />
                                      )}
                                      <span className="capitalize font-medium">
                                        {w.status === "rain"
                                          ? "Có mưa"
                                          : w.status === "clear"
                                          ? "Đẹp"
                                          : w.status}
                                      </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {w.message}
                                    </div>
                                  </motion.div>
                                ) : (
                                  <div
                                    key={idx}
                                    className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm min-w-[220px] max-w-xs"
                                  >
                                    {JSON.stringify(w)}
                                  </div>
                                )
                            )
                          ) : (
                            <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm min-w-[220px] max-w-xs">
                              {recommendations.weather_forecast}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                      {recommendPlaces.map((place, idx) => (
                        <RecommendCard
                          key={(place.name ?? "") + idx}
                          place={place}
                          imgFallback={imgFallback}
                          setImgFallback={setImgFallback}
                        />
                      ))}
                    </div>
                  </div>
                ) : recommendations ? (
                  <div className="text-center text-destructive text-lg font-medium py-12 rounded-xl bg-card/60 shadow">
                    Không tìm thấy địa điểm phù hợp với lựa chọn của bạn. Vui
                    lòng thử lại với từ khóa hoặc tỉnh/thành khác.
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
