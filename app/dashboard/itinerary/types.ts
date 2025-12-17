export type TimeSlot = "sáng" | "trưa" | "chiều" | "tối";

export interface Weather {
  temp: number;
  description: string;
}

export interface Location {
  tên: string;
  hình_ảnh?: string;
  đánh_giá?: number | string;
  tỉnh?: string;
  hoạt_động?: string;
  mô_tả?: string;
}

export interface DayPlan {
  ngày: number | string;
  date?: string;
  thời_tiết?: Weather;
  loại_ngày?: string;
  lịch_trình: Record<TimeSlot, Location | undefined>;
}

export interface Itinerary {
  tỉnh_thành: string;
  số_ngày: number;
  từ_khóa?: string[];
  lịch_trình?: DayPlan[];
}
