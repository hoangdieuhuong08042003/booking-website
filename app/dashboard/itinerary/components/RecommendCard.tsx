"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

export interface RecommendPlace {
  name?: string;
  province?: string;
  description?: string;
  rating?: number;
  image?: string;
}

export default function RecommendCard({
  place,
  imgFallback,
  setImgFallback,
  weatherSummary,
}: {
  place: RecommendPlace;
  imgFallback: Record<string, boolean>;
  setImgFallback: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  weatherSummary?: string;
}) {
  // Normalize fields for compatibility with both API field sets
  const normalizedPlace = {
    tên: place.name ?? "",
    tỉnh: place.province,
    mô_tả: place.description ?? "",
    đánh_giá: place.rating,
    hình_ảnh: place.image ?? "",
    hoạt_động: place["hoạt_động"],
  };
  const key = `${normalizedPlace.tên}-${normalizedPlace.tỉnh ?? ""}`;
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/10 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {normalizedPlace.tên[0]}
            </div>
            {normalizedPlace.tên}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            {normalizedPlace.tỉnh && (
              <span className="px-4 py-2 bg-card rounded-full text-foreground font-medium border border-border shadow-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {normalizedPlace.tỉnh}
              </span>
            )}
            {normalizedPlace.đánh_giá !== undefined && (
              <span className="px-4 py-2 bg-primary/10 rounded-full text-primary font-medium border border-primary/20 shadow-sm flex items-center gap-2">
                ⭐ {normalizedPlace.đánh_giá}
              </span>
            )}
          </div>
        </div>
        {weatherSummary && (
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium">Thời tiết:</span> {weatherSummary}
          </p>
        )}
      </div>
      {/* Content */}
      <div className="p-6 flex gap-4">
        {/* Image */}
        {normalizedPlace.hình_ảnh && (
          <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-muted relative">
            <Image
              src={
                imgFallback[key]
                  ? "/placeholder.svg?height=128&width=128"
                  : normalizedPlace.hình_ảnh
              }
              alt={normalizedPlace.tên}
              fill
              sizes="128px"
              className="object-cover"
              onError={() =>
                setImgFallback((prev) => ({
                  ...prev,
                  [key]: true,
                }))
              }
            />
          </div>
        )}
        {/* Details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {normalizedPlace.hoạt_động && (
              <span className="px-2 py-1 bg-muted rounded text-xs">
                {normalizedPlace.hoạt_động}
              </span>
            )}
          </div>
          {normalizedPlace.mô_tả && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {normalizedPlace.mô_tả}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
