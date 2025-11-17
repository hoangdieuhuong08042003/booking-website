"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users } from "lucide-react";

// Add: explicit form data type
export type SearchFormData = {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

interface SearchFormProps {
  onSearch: (formData: SearchFormData) => void; // use concrete type
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });

  // provinces state + loading
  const [provinces, setProvinces] = useState<
    { province_id: number; province_name: string }[]
  >([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingProvinces(true);
    fetch("https://vapi.vnappmob.com/api/v2/province/")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const results = data?.results || data?.provinces || [];
        setProvinces(results);
      })
      .catch(() => {
        if (!mounted) return;
        setProvinces([]);
      })
      .finally(() => mounted && setLoadingProvinces(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        Tìm kiếm khách sạn
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
      >
        {/* Location */}
        <div className="flex flex-col gap-2 items-start">
          <label className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Địa điểm
          </label>
          <select
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="">Chọn thành phố</option>
            {loadingProvinces ? (
              <option disabled>Đang tải...</option>
            ) : (
              provinces.map((p) => (
                <option key={p.province_id} value={String(p.province_id)}>
                  {p.province_name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Check in */}
        <div className="flex flex-col gap-2 items-start">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Nhận phòng
          </label>
          <Input
            type="date"
            value={formData.checkIn}
            onChange={(e) =>
              setFormData({ ...formData, checkIn: e.target.value })
            }
            className="w-full border border-border"
          />
        </div>

        {/* Check out */}
        <div className="flex flex-col gap-2 items-start">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Trả phòng
          </label>
          <Input
            type="date"
            value={formData.checkOut}
            onChange={(e) =>
              setFormData({ ...formData, checkOut: e.target.value })
            }
            className="w-full border border-border"
          />
        </div>

        {/* Guests */}
        <div className="flex flex-col gap-2 items-start">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Khách
          </label>
          <select
            value={formData.guests}
            onChange={(e) =>
              setFormData({ ...formData, guests: parseInt(e.target.value) })
            }
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value={1}>1 khách</option>
            <option value={2}>2 khách</option>
            <option value={3}>3 khách</option>
            <option value={4}>4 khách</option>
            <option value={5}>5+ khách</option>
          </select>
        </div>

        {/* Button – cho nó full row trên mobile */}
        <div className="md:col-span-4 flex md:justify-center">
          <Button
            type="submit"
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white"
          >
            Tìm kiếm
          </Button>
        </div>
      </form>
    </div>
  );
}
