"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Navigation, Coffee, Camera, Moon } from "lucide-react";
import type { ComponentType } from "react";
import { TimeSlot, ItineraryDayResult, Weather } from "../types";

// Type guard cho Weather object
function isWeather(obj: unknown): obj is Weather {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "temp" in obj &&
    "description" in obj &&
    typeof (obj as Record<string, unknown>).temp === "number" &&
    typeof (obj as Record<string, unknown>).description === "string"
  );
}

// Hàm lấy emoji thời tiết
function getWeatherEmoji(temp: number) {
  if (temp >= 30) return "🔥";
  if (temp > 25) return "☀️";
  if (temp > 20) return "🌤️";
  if (temp > 15) return "🌥️";
  return "🌧️";
}

// Hàm hiển thị thông tin thời tiết
function renderWeather(weatherInfo?: string | Weather) {
  if (!weatherInfo) return null;
  if (isWeather(weatherInfo)) {
    return (
      <>
        <span className="text-lg">{getWeatherEmoji(weatherInfo.temp)}</span>
        {weatherInfo.temp}°C • {weatherInfo.description}
      </>
    );
  }
  return <>{weatherInfo}</>;
}

export default function DayCard({
  dayData,
  dayIndex,
  imgFallback,
  setImgFallback,
}: {
  dayData: ItineraryDayResult;
  dayIndex: number;
  imgFallback: Record<string, boolean>;
  setImgFallback: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const timeSlots: TimeSlot[] = ["sáng", "trưa", "chiều"];
  const timeIcons: Record<
    TimeSlot | "tối_ăn_uống" | "tối",
    ComponentType<{ className?: string }>
  > = {
    sáng: Navigation,
    trưa: Coffee,
    chiều: Camera,
    tối_ăn_uống: Coffee,
    tối: Moon,
  };

  // Lấy ngày và thông tin thời tiết từ đúng trường trả về của API
  const dayLabel = dayData?.date ?? "";
  const weatherInfo = dayData?.weather_forecast;

  // Hàm render card cho từng slot
  function renderSlot(slot: TimeSlot | "tối_ăn_uống" | "tối", label?: string) {
    // Lấy location từ dayData.plan (đúng chuẩn API trả về)
    const location = dayData?.plan?.[slot];
    if (!location || !location.name) return null;
    const key = `${dayIndex}-${slot}-${location.name ?? ""}`;
    const Icon = timeIcons[slot];
    return (
      <motion.div
        key={slot}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay:
            slot === "tối_ăn_uống" || slot === "tối"
              ? 0.35 + dayIndex * 0.1
              : 0.3 + dayIndex * 0.1,
        }}
      >
        {/* Time Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground capitalize">
            {label ?? slot}
          </span>
        </div>
        {/* Location Card */}
        <div className="flex bg-white rounded-xl transition-all duration-300 border border-border/50 overflow-hidden">
          {/* Location Image - Left Side */}
          <div className="relative flex-shrink-0 w-[420px] h-[320px] bg-muted flex items-center justify-center">
            {location.image && (
              <div className="w-full h-full relative">
                <Image
                  src={
                    imgFallback[key]
                      ? "/placeholder.svg?height=512&width=512"
                      : location.image
                  }
                  alt={location.name}
                  fill
                  sizes="420px"
                  className="object-cover rounded-none transition-transform duration-300"
                  onError={() =>
                    setImgFallback((prev) => ({
                      ...prev,
                      [key]: true,
                    }))
                  }
                />
              </div>
            )}
          </div>
          {/* Location Details - Right Side */}
          <div className="flex flex-col justify-center min-w-0 space-y-2 px-8 py-6 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold text-foreground text-lg">
                {location.name}
              </h4>
              {location.rating && (
                <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full flex-shrink-0">
                  <span className="text-primary text-sm">⭐</span>
                  <span className="text-primary text-sm font-semibold">
                    {location.rating}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {location.province && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {location.province}
                </span>
              )}
              {location["hoạt_động"] && (
                <span className="px-2 py-1 bg-muted rounded text-xs">
                  {location["hoạt_động"]}
                </span>
              )}
            </div>
            {location.description && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 transition-all">
                {location.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

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
            {/* Số thứ tự ngày */}
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {dayIndex + 1}
            </div>
            Ngày {dayIndex + 1}
            {/* Ngày thực tế */}
            <span className="ml-3 px-3 py-1 bg-white/70 rounded-full text-primary font-semibold border border-primary/20 text-base">
              {dayLabel}
            </span>
          </h3>
          <div className="flex items-center gap-4 text-sm">
            {weatherInfo && (
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full text-foreground font-medium border border-blue-500/20 shadow-sm flex items-center gap-2">
                {renderWeather(weatherInfo)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="p-6 space-y-6">
        {timeSlots.map((slot) => renderSlot(slot))}
        {renderSlot("tối_ăn_uống", "Tối: Ăn uống / Nhà hàng")}
        {renderSlot("tối", "Tối: Cafe / Chụp ảnh / Vui chơi")}
      </div>
    </motion.div>
  );
}
