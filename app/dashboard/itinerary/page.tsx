"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PRIMARY_CATEGORY,
  ATTRIBUTES,
  ACTIVITIES,
  PHYSICAL_TYPE,
} from "@/constants/keywords";
import { Sparkles } from "lucide-react";
import InputCard from "./components/InputCard";
import KeywordGroup from "./components/KeywordGroup";
import ItineraryHeader from "./components/ItineraryHeader";
import { DayPlan } from "./types";
import DayCard from "./components/DayCard";
import RecommendCard from "./components/RecommendCard";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import { useTourismApi } from "@/app/hooks/useItinerary";

export default function ItineraryPage() {
  const [province, setProvince] = useState("Huế");
  const [days, setDays] = useState(2);
  const [keywords, setKeywords] = useState<string[]>([]);
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

  const toggleKeyword = (k: string) => {
    setKeywords((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

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
              keywords={keywords}
              loading={itineraryLoading}
              fetchItinerary={fetchItinerary}
              fetchRecommendations={fetchRecommendations}
              recommendLoading={recommendLoading}
            />
          </motion.div>

          {/* Keywords Section */}
          <div className="lg:col-span-2 space-y-8">
            <KeywordGroup
              title="I. Chủ đề chính"
              items={PRIMARY_CATEGORY}
              selected={keywords}
              toggle={toggleKeyword}
              delay={0.3}
            />
            <KeywordGroup
              title="II. Đặc điểm / Tính chất"
              items={ATTRIBUTES}
              selected={keywords}
              toggle={toggleKeyword}
              delay={0.4}
            />
            <KeywordGroup
              title="III. Hoạt động"
              items={ACTIVITIES}
              selected={keywords}
              toggle={toggleKeyword}
              delay={0.5}
            />
            <KeywordGroup
              title="IV. Loại địa hình"
              items={PHYSICAL_TYPE}
              selected={keywords}
              toggle={toggleKeyword}
              delay={0.6}
            />
          </div>
        </div>

        {/* Result Section */}
        <AnimatePresence mode="wait">
          {itinerary && (
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
                  {itinerary.lịch_trình?.map(
                    (dayData: DayPlan, dayIndex: number) => (
                      <DayCard
                        key={dayIndex}
                        dayData={dayData}
                        dayIndex={dayIndex}
                        imgFallback={imgFallback}
                        setImgFallback={setImgFallback}
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Recommend Section */}
        {recommendations && recommendations.danh_sách_địa_điểm?.length > 0 && (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Gợi ý địa điểm nổi bật
            </h2>
            {/* Weather summary */}
            {recommendations.thông_tin_thời_tiết && (
              <div className="mb-2 text-base text-muted-foreground">
                <span className="font-medium">Thời tiết:</span>{" "}
                {recommendations.thông_tin_thời_tiết}
              </div>
            )}
            <div className="flex flex-col gap-6">
              {recommendations.danh_sách_địa_điểm.map((place, idx) => (
                <RecommendCard
                  key={place.tên + idx}
                  place={place}
                  imgFallback={imgFallback}
                  setImgFallback={setImgFallback}
                  // Chỉ truyền weatherSummary cho card đầu tiên nếu muốn
                  weatherSummary={
                    idx === 0 ? recommendations.thông_tin_thời_tiết : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
