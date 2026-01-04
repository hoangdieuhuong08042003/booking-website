"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Sparkles, Clock, Map } from "lucide-react";
import { useState, useEffect } from "react";

// Import getProvinces server action
import { getProvinces } from "@/app/_actions/listing/listing-province-actions";

export default function InputCard({
  province,
  setProvince,
  days,
  setDays,
  keywords,
  loading,
  fetchItinerary,
  fetchRecommendations,
  recommendLoading,
}: {
  province: string;
  setProvince: (v: string) => void;
  days: string[];
  setDays: (v: string[]) => void;
  keywords: string[];
  loading: boolean;
  fetchItinerary: (params: {
    province: string;
    days: string[];
    keywords: string[];
  }) => void | Promise<void>;
  fetchRecommendations: (params: {
    province: string;
    keywords: string[];
    days?: string[];
  }) => void | Promise<void>;
  recommendLoading: boolean;
}) {
  // State cho ngày bắt đầu và kết thúc
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Lấy ngày hôm nay theo định dạng yyyy-mm-dd
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Hàm lấy ngày tối đa cho endDate (tối đa 3 ngày kể từ startDate)
  const getMaxEndDate = () => {
    if (!startDate) return undefined;
    const start = new Date(startDate);
    const maxEnd = new Date(start);
    maxEnd.setDate(start.getDate() + 2); // tối đa 3 ngày (start + 2)
    // Không cho phép chọn ngày trước hôm nay
    if (maxEnd < today) return todayStr;
    return maxEnd.toISOString().split("T")[0];
  };

  // Khi chọn ngày bắt đầu/kết thúc, cập nhật mảng days (tối đa 3 ngày)
  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") setStartDate(value);
    else setEndDate(value);

    const s = type === "start" ? value : startDate;
    const e = type === "end" ? value : endDate;
    if (s && e && s <= e) {
      // Tạo mảng ngày từ s đến e, tối đa 3 ngày
      const start = new Date(s);
      const end = new Date(e);
      const diff = Math.min(
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
          1,
        3
      );
      const daysArr: string[] = [];
      for (let i = 0; i < diff; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        // Format dd/mm/yyyy
        daysArr.push(
          d
            .toLocaleDateString("en-GB")
            .split("/")
            .map((x) => x.padStart(2, "0"))
            .join("/")
        );
      }
      setDays(daysArr);
    } else {
      setDays([]);
    }
  };

  // Hiển thị ngày đã chọn
  const displayDays = days && days.length > 0 ? days.join(", ") : "Chưa chọn";

  // State for provinces and search
  const [provinces, setProvinces] = useState<{ id: string; name: string }[]>(
    []
  );
  const [provinceSearch, setProvinceSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    getProvinces().then((data) => setProvinces(data));
  }, []);

  // Filtered provinces by search
  const filteredProvinces =
    provinceSearch.trim().length === 0
      ? provinces
      : provinces.filter((p) =>
          p.name.toLowerCase().includes(provinceSearch.toLowerCase())
        );

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
              type="text"
              value={
                showDropdown
                  ? provinceSearch
                  : provinces.find((p) => p.name === province)?.name || province
              }
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              onChange={(e) => {
                setProvinceSearch(e.target.value);
                setShowDropdown(true);
              }}
              placeholder="Tìm kiếm tỉnh/thành phố..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
              autoComplete="off"
            />
            {showDropdown && (
              <div className="absolute z-10 left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredProvinces.length === 0 ? (
                  <div className="px-4 py-2 text-muted-foreground text-sm">
                    Không tìm thấy
                  </div>
                ) : (
                  filteredProvinces.map((p) => (
                    <div
                      key={p.id}
                      className={`px-4 py-2 cursor-pointer hover:bg-accent/30 ${
                        province === p.name ? "bg-accent/20 font-semibold" : ""
                      }`}
                      onMouseDown={() => {
                        setProvince(p.name);
                        setProvinceSearch(p.name);
                        setShowDropdown(false);
                      }}
                    >
                      {p.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Chọn ngày bắt đầu
          </label>
          <div className="flex flex-col gap-2 relative">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange("start", e.target.value)}
                className="pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer text-foreground w-full"
                min={todayStr}
                max={endDate || undefined}
              />
            </div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Chọn ngày kết thúc
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange("end", e.target.value)}
              className="pl-4 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer text-foreground w-full"
              min={startDate || todayStr}
              max={getMaxEndDate()}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Ngày đã chọn: {displayDays}
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
          className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
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
        {/* Button chỉ trả về các địa điểm gợi ý */}
        <motion.button
          disabled={recommendLoading}
          onClick={() =>
            fetchRecommendations({
              province,
              keywords,
              days,
            })
          }
          whileHover={{ scale: recommendLoading ? 1 : 1.02 }}
          whileTap={{ scale: recommendLoading ? 1 : 0.98 }}
          className="w-full px-6 py-4 bg-accent text-primary border border-primary rounded-xl font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {recommendLoading ? (
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
              Đang lấy gợi ý...
            </>
          ) : (
            <>
              <Map className="w-5 h-5" />
              Chỉ xem gợi ý địa điểm
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
