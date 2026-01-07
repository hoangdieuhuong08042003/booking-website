"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import { Itinerary } from "../types";

export default function ItineraryHeader({
  itinerary,
}: {
  itinerary: Itinerary;
}) {
  // Tính tổng số ngày dựa trên daily_results nếu có
  const totalDays =
    Array.isArray(itinerary.daily_results) && itinerary.daily_results.length > 0
      ? itinerary.daily_results.length
      : itinerary.số_ngày;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border rounded-2xl p-6 sm:p-8 shadow-lg"
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            Lịch trình {itinerary.tỉnh_thành}
          </h2>
          <p className="text-muted-foreground">
            Hành trình {totalDays} ngày khám phá những điều tuyệt vời
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">{totalDays} ngày</span>
        </div>
      </div>

      {itinerary.từ_khóa && itinerary.từ_khóa.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Chủ đề đã chọn
          </p>
          <div className="flex flex-wrap gap-2">
            {itinerary.từ_khóa.map((keyword: string) => (
              <motion.span
                key={keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
