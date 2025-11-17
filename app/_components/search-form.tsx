"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users } from "lucide-react";

interface SearchFormProps {
  onSearch: (formData: any) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [formData, setFormData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });

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
          <Input
            type="text"
            placeholder="Chọn thành phố"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full border border-border"
          />
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
