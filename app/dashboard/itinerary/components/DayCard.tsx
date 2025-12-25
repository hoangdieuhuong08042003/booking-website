"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Navigation, Coffee, Camera, Moon } from "lucide-react";
import type { ComponentType } from "react";
import { DayPlan, TimeSlot } from "../types";
import { getProxiedUrl } from "@/lib/utils";

export default function DayCard({
  dayData,
  dayIndex,
  imgFallback,
  setImgFallback,
}: {
  dayData: DayPlan;
  dayIndex: number;
  imgFallback: Record<string, boolean>;
  setImgFallback: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const timeSlots: TimeSlot[] = ["sáng", "trưa", "chiều", "tối"];
  const timeIcons: Record<TimeSlot, ComponentType<{ className?: string }>> = {
    sáng: Navigation,
    trưa: Coffee,
    chiều: Camera,
    tối: Moon,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 + dayIndex * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Day Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/10 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {dayData.ngày}
            </div>
            Ngày {dayData.ngày}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            {dayData.date && (
              <span className="px-4 py-2 bg-card rounded-full text-foreground font-medium border border-border shadow-sm">
                {dayData.date}
              </span>
            )}
            {dayData.thời_tiết && (
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full text-foreground font-medium border border-blue-500/20 shadow-sm flex items-center gap-2">
                <span className="text-lg">
                  {dayData.thời_tiết.temp > 25 ? "☀️" : "🌤️"}
                </span>
                {dayData.thời_tiết.temp}°C • {dayData.thời_tiết.description}
              </span>
            )}
          </div>
        </div>
        {dayData.loại_ngày && (
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium">Loại ngày:</span> {dayData.loại_ngày}
          </p>
        )}
      </div>

      {/* Time Slots */}
      <div className="p-6 space-y-6">
        {timeSlots.map((timeSlot) => {
          const location = dayData.lịch_trình[timeSlot];
          if (!location) return null;

          const key = `${dayIndex}-${timeSlot}-${location.tên ?? ""}`;
          const Icon = timeIcons[timeSlot];

          return (
            <motion.div
              key={timeSlot}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + dayIndex * 0.1 }}
              className="group"
            >
              {/* Time Badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground capitalize">
                  {timeSlot}
                </span>
              </div>

              {/* Location Card */}
              <div className="flex gap-4 bg-white rounded-xl p-4 transition-all duration-300 border border-border/50">
                {/* Location Image */}
                {location.hình_ảnh && (
                  <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-muted relative">
                    <Image
                      src={
                        imgFallback[key]
                          ? "/placeholder.svg?height=128&width=128"
                          : getProxiedUrl(location.hình_ảnh)
                      }
                      alt={location.tên}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={() =>
                        setImgFallback((prev) => ({
                          ...prev,
                          [key]: true,
                        }))
                      }
                    />
                  </div>
                )}

                {/* Location Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-foreground text-lg">
                      {location.tên}
                    </h4>
                    {location.đánh_giá && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full flex-shrink-0">
                        <span className="text-primary text-sm">⭐</span>
                        <span className="text-primary text-sm font-semibold">
                          {location.đánh_giá}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {location.tỉnh && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location.tỉnh}
                      </span>
                    )}
                    {location.hoạt_động && (
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        {location.hoạt_động}
                      </span>
                    )}
                  </div>

                  {location.mô_tả && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                      {location.mô_tả}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
