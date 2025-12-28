"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Users,
  Filter,
  BedDouble,
  Wifi,
  DollarSign,
  Search,
  RotateCcw,
} from "lucide-react";
import { Amenity } from "@prisma/client";
import {
  getRoomTypes,
  getAmenity,
} from "@/app/_actions/listing/listing-amenity-actions";
import {
  getProvinces,
  getWards,
} from "@/app/_actions/listing/listing-province-actions";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Add slider import

// Filter Data
export type FilterData = {
  location?: string;
  ward?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  roomTypeId?: string;
  priceRange?: [number, number];
  selectedAmenities?: string[];
};

interface FilterSidebarProps {
  onFilterChange: (data: FilterData) => void;
  onSearch?: (data: FilterData) => void;
}

type RoomTypeOption = { value: string; label: string };

const defaultFilters: FilterData = {
  location: "",
  ward: "",
  checkIn: "",
  checkOut: "",
  guests: 2,
  roomTypeId: "",
  priceRange: undefined,
  selectedAmenities: [],
};

export function FilterSidebar({
  onFilterChange,
  onSearch,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterData>(defaultFilters);

  const [provinces, setProvinces] = useState<
    { province_id: string; province_name: string }[]
  >([]);
  const [wards, setWards] = useState<{ ward_id: string; ward_name: string }[]>(
    []
  );
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeOption[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

  // Add state for min/max price from DB
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000000,
  });

  // Add state for price slider
  const [priceSlider, setPriceSlider] = useState<[number, number]>([
    0, 10000000,
  ]);

  // Fetch Provinces
  useEffect(() => {
    setLoadingProvinces(true);
    getProvinces()
      .then((data) =>
        setProvinces(
          (data as { id: string; name: string }[] | undefined)?.map((p) => ({
            province_id: p.id,
            province_name: p.name,
          })) ?? []
        )
      )
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Fetch Wards when province changes
  useEffect(() => {
    if (!filters.location) {
      setWards([]);
      setFilters((prev) => ({ ...prev, ward: "" }));
      return;
    }
    setLoadingWards(true);
    getWards(filters.location)
      .then((data) =>
        setWards(
          (data as { id: string; name: string }[] | undefined)?.map((w) => ({
            ward_id: w.id,
            ward_name: w.name,
          })) ?? []
        )
      )
      .finally(() => setLoadingWards(false));
  }, [filters.location]);

  // Fetch Amenities
  useEffect(() => {
    setLoadingAmenities(true);
    getAmenity()
      .then((data) => setAmenities((data as Amenity[] | undefined) ?? []))
      .finally(() => setLoadingAmenities(false));
  }, []);

  // Fetch RoomTypes
  useEffect(() => {
    setLoadingRoomTypes(true);
    getRoomTypes()
      .then((data) => {
        const items =
          (data as { id: string; name: string }[] | undefined) ?? [];
        setRoomTypes([
          { value: "", label: "Tất cả loại phòng" },
          ...items.map((r) => ({ value: r.id, label: r.name })),
        ]);
      })
      .finally(() => setLoadingRoomTypes(false));
  }, []);

  // Fetch min/max price from backend
  useEffect(() => {
    fetch("/api/listing/price-range")
      .then((res) => res.json())
      .then((data) => {
        if (data?.min !== undefined && data?.max !== undefined) {
          setPriceRange({ min: data.min, max: data.max });
        }
      });
  }, []);

  // Update filters & notify parent
  const updateFilter = (key: keyof FilterData, value: unknown) => {
    setFilters((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const toggleAmenity = (name: string) => {
    setFilters((prev) => {
      const list = prev.selectedAmenities || [];
      return {
        ...prev,
        selectedAmenities: list.includes(name)
          ? list.filter((x) => x !== name)
          : [...list, name],
      };
    });
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(filters);
    }
    // Do not call onFilterChange here
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    if (onSearch) {
      onSearch(defaultFilters);
    }
  };

  // Update slider when priceRange changes
  useEffect(() => {
    setPriceSlider([
      filters.priceRange?.[0] ?? priceRange.min,
      filters.priceRange?.[1] ?? priceRange.max,
    ]);
  }, [priceRange, filters.priceRange]);

  // Handler for slider change
  const handlePriceSliderChange = (values: [number, number]) => {
    setPriceSlider(values);
    updateFilter("priceRange", values);
  };

  return (
    <aside className="w-full md:w-80 bg-white rounded-sm shadow-xl p-7 mb-8 md:mb-0 md:mr-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6 justify-center">
        <Filter className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold tracking-tight text-primary text-center">
          Bộ lọc tìm kiếm
        </h2>
      </div>

      <div className="flex flex-col gap-7">
        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold flex items-center gap-2 mb-1 text-gray-700">
            <MapPin className="w-4 h-4 text-primary" />
            Tỉnh/Thành phố
          </label>
          <select
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 transition"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {loadingProvinces ? (
              <option disabled>Đang tải...</option>
            ) : (
              provinces.map((p) => (
                <option key={p.province_id} value={p.province_id}>
                  {p.province_name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="border-t pt-5 flex flex-col gap-2">
          <label className="text-sm font-semibold flex items-center gap-2 mb-1 text-gray-700">
            <MapPin className="w-4 h-4 text-primary" />
            Quận/Huyện/Xã
          </label>
          <select
            value={filters.ward}
            onChange={(e) => updateFilter("ward", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 transition ${
              !filters.location
                ? "opacity-50 cursor-not-allowed bg-gray-100"
                : ""
            }`}
            disabled={!filters.location}
          >
            <option value="">Chọn quận/huyện/xã</option>
            {loadingWards ? (
              <option disabled>Đang tải...</option>
            ) : (
              wards.map((w) => (
                <option key={w.ward_id} value={w.ward_id}>
                  {w.ward_name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="border-t pt-5 grid grid-cols-2 gap-4">
          {/* Check-in */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 mb-1 text-gray-700">
              <Calendar className="w-4 h-4 text-primary" />
              Nhận phòng
            </label>
            <Input
              type="date"
              value={filters.checkIn ?? ""}
              onChange={(e) => updateFilter("checkIn", e.target.value)}
              className="rounded-lg"
            />
          </div>
          {/* Check-out */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 mb-1 text-gray-700">
              <Calendar className="w-4 h-4 text-primary" />
              Trả phòng
            </label>
            <Input
              type="date"
              value={filters.checkOut ?? ""}
              onChange={(e) => updateFilter("checkOut", e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="border-t pt-5 grid grid-cols-2 gap-4">
          {/* Guests */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 mb-1 text-gray-700">
              <Users className="w-4 h-4 text-primary" />
              Khách
            </label>
            <select
              value={filters.guests}
              onChange={(e) => updateFilter("guests", parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 transition"
            >
              <option value={1}>1 khách</option>
              <option value={2}>2 khách</option>
              <option value={3}>3 khách</option>
              <option value={4}>4 khách</option>
              <option value={5}>5+ khách</option>
            </select>
          </div>
          {/* Room Type */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2 mb-1 text-gray-700">
              <BedDouble className="w-4 h-4 text-primary" />
              Loại phòng
            </label>
            <select
              value={filters.roomTypeId}
              onChange={(e) => updateFilter("roomTypeId", e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 transition"
            >
              {loadingRoomTypes ? (
                <option disabled>Đang tải...</option>
              ) : (
                roomTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="border-t pt-5">
          <label className="text-sm font-semibold flex items-center gap-2 mb-2 text-gray-700">
            <DollarSign className="w-4 h-4 text-primary" />
            Giá (VND/đêm)
          </label>
          <div className="flex flex-col gap-3">
            <Slider
              min={priceRange.min}
              max={priceRange.max}
              step={100000}
              value={priceSlider}
              onValueChange={(values) =>
                handlePriceSliderChange(values as [number, number])
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Từ {priceSlider[0].toLocaleString()}₫</span>
              <span>Đến {priceSlider[1].toLocaleString()}₫</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="border-t pt-5">
          <label className="text-sm font-semibold flex items-center gap-2 mb-2 text-gray-700">
            <Wifi className="w-4 h-4 text-primary" />
            Tiện nghi
          </label>
          <div className="grid grid-cols-2 gap-2">
            {loadingAmenities ? (
              <span className="col-span-2">Đang tải...</span>
            ) : (
              amenities.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.selectedAmenities?.includes(a.name) || false
                    }
                    onChange={() => toggleAmenity(a.name)}
                    className="accent-primary"
                  />
                  {a.name}
                </label>
              ))
            )}
          </div>
        </div>

        {/* Search and Reset Buttons */}
        <div className="border-t pt-6 flex gap-3">
          <Button
            onClick={handleSearch}
            className="flex-1 flex items-center justify-center gap-2 text-base font-semibold h-11 rounded-lg shadow-md bg-primary hover:bg-primary/90 transition"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 text-base font-semibold h-11 rounded-lg border-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
            Xóa
          </Button>
        </div>
      </div>
    </aside>
  );
}
