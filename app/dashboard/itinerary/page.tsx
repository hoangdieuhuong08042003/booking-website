"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRIMARY_OPTIONS,
  ATTRIBUTE_OPTIONS,
  ACTIVITY_OPTIONS,
} from "@/constants/keywords";
import { Sparkles } from "lucide-react";
import InputCard from "./components/InputCard";
import KeywordGroup from "./components/KeywordGroup";
import ItineraryHeader from "./components/ItineraryHeader";
import DayCard from "./components/DayCard";
import RecommendCard from "./components/RecommendCard";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import { useTourismApi } from "@/app/hooks/useItinerary";

export default function ItineraryPage() {
  const [province, setProvince] = useState("Huế");
  const [days, setDays] = useState<string[]>([]);
  // New state for option selections
  const [primary, setPrimary] = useState<number | null>(0); // index of PRIMARY_OPTIONS
  const [attributes, setAttributes] = useState<number[]>([]); // indices of ATTRIBUTE_OPTIONS
  const [activities, setActivities] = useState<number[]>([]); // indices of ACTIVITY_OPTIONS
  const [imgFallback, setImgFallback] = useState<Record<string, boolean>>({});

  // const { itinerary, loading, fetchItinerary } = useItinerary();
  const {
    itinerary,
    itineraryLoading,
    fetchItinerary,
    recommendLoading,
    fetchRecommendations,
    recommendations,
  } = useTourismApi();

  // Map selected options to keywords
  const selectedKeywords = [
    ...(primary !== null ? PRIMARY_OPTIONS[primary].map : []),
    ...attributes.flatMap((idx) => ATTRIBUTE_OPTIONS[idx].map),
    ...activities.flatMap((idx) => ACTIVITY_OPTIONS[idx].map),
  ];

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
              // Pass mapped keywords to InputCard
              keywords={selectedKeywords}
              loading={itineraryLoading}
              fetchItinerary={fetchItinerary}
              fetchRecommendations={fetchRecommendations}
              recommendLoading={recommendLoading}
            />
          </motion.div>

          {/* Keywords Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: PRIMARY */}
            <KeywordGroup
              title="I. Bạn muốn đi đâu?"
              items={PRIMARY_OPTIONS.map((opt) => opt.label)}
              selected={primary !== null ? [primary] : []}
              toggle={(idx: number) => setPrimary(idx === primary ? null : idx)}
              delay={0.3}
            />
            {/* Step 2: ATTRIBUTES */}
            <KeywordGroup
              title="II. Cảm giác mong muốn"
              items={ATTRIBUTE_OPTIONS.map((opt) => opt.label)}
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
            {/* Step 3: ACTIVITIES */}
            <KeywordGroup
              title="III. Muốn làm gì?"
              items={ACTIVITY_OPTIONS.map((opt) => opt.label)}
              selected={activities}
              toggle={(idx: number) => {
                setActivities((prev) =>
                  prev.includes(idx)
                    ? prev.filter((i) => i !== idx)
                    : [...prev, idx]
                );
              }}
              delay={0.5}
            />
          </div>
        </div>

        {/* Result Section */}
        <AnimatePresence mode="wait">
          {itinerary && itinerary.daily_results?.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="space-y-6">
                {/* Header Card */}
                <ItineraryHeader itinerary={itinerary} />
                {/* Day Cards */}
                <div className="space-y-6">
                  {itinerary.daily_results?.map(
                    (dayResult, dayIndex: number) => (
                      <DayCard
                        key={dayIndex}
                        dayData={{
                          ...dayResult.plan,
                          date: dayResult.date,
                          weather_forecast: dayResult.weather_forecast,
                        }}
                        dayIndex={dayIndex}
                        imgFallback={imgFallback}
                        setImgFallback={setImgFallback}
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ) : itinerary &&
            (!itinerary.daily_results ||
              itinerary.daily_results.length === 0) ? (
            <div className="mt-12 text-center text-destructive text-lg font-medium">
              Không tìm thấy lịch trình phù hợp với lựa chọn của bạn. Vui lòng
              thử lại với từ khóa hoặc tỉnh/thành khác.
            </div>
          ) : null}
        </AnimatePresence>
        {/* Recommend Section */}
        {recommendations && recommendations.results?.length > 0 ? (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Gợi ý địa điểm nổi bật
            </h2>
            {/* Weather summary */}
            {recommendations.weather_forecast && (
              <div className="mb-2 text-base text-muted-foreground">
                <span className="font-medium">Thời tiết:</span>{" "}
                {Array.isArray(recommendations.weather_forecast)
                  ? recommendations.weather_forecast.join(" | ")
                  : recommendations.weather_forecast}
              </div>
            )}
            <div className="flex flex-col gap-6">
              {recommendations.results.map((place, idx) => (
                <RecommendCard
                  key={place.name + idx}
                  place={{
                    name: place.name,
                    province: place.province,
                    description: place.description,
                    rating: place.rating,
                    image: place.image,
                  }}
                  imgFallback={imgFallback}
                  setImgFallback={setImgFallback}
                  weatherSummary={
                    idx === 0
                      ? Array.isArray(recommendations.weather_forecast)
                        ? recommendations.weather_forecast.join(" | ")
                        : recommendations.weather_forecast
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ) : recommendations &&
          (!recommendations.results || recommendations.results.length === 0) ? (
          <div className="mt-12 text-center text-destructive text-lg font-medium">
            Không tìm thấy địa điểm phù hợp với lựa chọn của bạn. Vui lòng thử
            lại với từ khóa hoặc tỉnh/thành khác.
          </div>
        ) : null}
      </div>
    </div>
  );
}
