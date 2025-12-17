"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Sparkles, Clock } from "lucide-react";

export default function InputCard({
  province,
  setProvince,
  days,
  setDays,
  keywords,
  loading,
  fetchItinerary,
}: {
  province: string;
  setProvince: (v: string) => void;
  days: number;
  setDays: (v: number) => void;
  keywords: string[];
  loading: boolean;
  fetchItinerary: (params: {
    province: string;
    days: number;
    keywords: string[];
  }) => void | Promise<void>;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-lg sticky top-6">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Thông tin chuyến đi
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tỉnh / Thành phố
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Nhập tên tỉnh thành..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Số ngày
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer text-foreground"
            >
              <option value={1}>1 ngày</option>
              <option value={2}>2 ngày</option>
              <option value={3}>3 ngày</option>
              <option value={4}>4 ngày</option>
              <option value={5}>5 ngày</option>
            </select>
          </div>
        </div>

        {keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-4 border-t border-border"
          >
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Đã chọn: {keywords.length} từ khóa
            </p>
            <div className="flex flex-wrap gap-2">
              {keywords.slice(0, 3).map((k) => (
                <span
                  key={k}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {k}
                </span>
              ))}
              {keywords.length > 3 && (
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  +{keywords.length - 3}
                </span>
              )}
            </div>
          </motion.div>
        )}

        <motion.button
          disabled={loading}
          onClick={() =>
            fetchItinerary({
              province,
              days,
              keywords,
            })
          }
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Clock className="w-5 h-5" />
              </motion.div>
              Đang tạo lịch trình...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Tạo lịch trình
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
