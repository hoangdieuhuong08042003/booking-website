export type TimeSlot = "sáng" | "trưa" | "chiều" | "tối";

export interface Weather {
  temp: number;
  description: string;
}

export interface Location {
  name: string;
  image?: string;
  rating?: number | string;
  province?: string;
  "hoạt_động"?: string;
  description?: string;
  
}



export interface Itinerary {
  tỉnh_thành?: string;
  số_ngày?: number;
  từ_khóa?: string[];
  daily_results?: ItineraryDayResult[];
  message?: string;
}

// Type cho từng ngày trong lịch trình
export interface ItineraryDayResult {
  date: string;
  weather_forecast: string | Weather;
  plan: {
    "thời tiết": string;
    "sáng": Location ;
    "trưa": Location ;
    "chiều": Location ;
    "tối_ăn_uống": Location ;
    "tối": Location ;
  };
}

// Type cho dữ liệu plan từ API
export type ItineraryPlan = {
  "thời tiết"?: string;
  sáng?: Location ;
  trưa?: Location ;
  chiều?: Location ;
  tối_ăn_uống?: Location ;
  tối?: Location ;
  date?: string;
  weather_forecast?: string | Weather;
};
