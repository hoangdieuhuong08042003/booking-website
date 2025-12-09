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
  getDistricts,
  getProvinces,
} from "@/app/_actions/listing/listing-province-actions";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"; // Add slider import

// Filter Data
export type FilterData = {
  location?: string;
  district?: string; // <-- add
  ward?: string; // <-- add
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
  district: "", // <-- add
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
    { province_id: number; province_name: string }[]
  >([]);
  const [districts, setDistricts] = useState<
    { district_id: number; district_name: string }[]
  >([]); // <-- new
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false); // <-- new

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
          (data as { id: number; name: string }[] | undefined)?.map((p) => ({
            province_id: p.id,
            province_name: p.name,
          })) ?? []
        )
      )
      .finally(() => setLoadingProvinces(false));
  }, []);

  // Fetch Districts when province changes
  useEffect(() => {
    if (!filters.location) {
      setDistricts([]);
      setFilters((prev) => ({ ...prev, district: "", ward: "" }));
      return;
    }
    setLoadingDistricts(true);
    getDistricts(Number(filters.location))
      .then((data) =>
        setDistricts(
          (data as { id: number; name: string }[] | undefined)?.map((d) => ({
            district_id: d.id,
            district_name: d.name,
          })) ?? []
        )
      )
      .finally(() => setLoadingDistricts(false));
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
    <aside className="w-full md:w-72 bg-white rounded-lg shadow-lg p-6 mb-8 md:mb-0 md:mr-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Bộ lọc</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Location */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary" />
            Địa điểm
          </label>
          <select
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
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
        {/* District */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary" />
            Quận/Huyện
          </label>
          <select
            value={filters.district}
            onChange={(e) => updateFilter("district", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            disabled={!filters.location}
          >
            <option value="">Chọn quận/huyện</option>
            {loadingDistricts ? (
              <option disabled>Đang tải...</option>
            ) : (
              districts.map((d) => (
                <option key={d.district_id} value={String(d.district_id)}>
                  {d.district_name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Check-in */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            Nhận phòng
          </label>
          <Input
            type="date"
            value={filters.checkIn ?? ""}
            onChange={(e) => updateFilter("checkIn", e.target.value)}
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-primary" />
            Trả phòng
          </label>
          <Input
            type="date"
            value={filters.checkOut ?? ""}
            onChange={(e) => updateFilter("checkOut", e.target.value)}
          />
        </div>

        {/* Guests */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            Khách
          </label>
          <select
            value={filters.guests}
            onChange={(e) => updateFilter("guests", parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
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
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <BedDouble className="w-4 h-4 text-primary" />
            Loại phòng
          </label>
          <select
            value={filters.roomTypeId}
            onChange={(e) => updateFilter("roomTypeId", e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
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

        {/* Price */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-primary" />
            Giá (VND/đêm)
          </label>
          <div className="flex flex-col gap-2">
            <Slider
              min={priceRange.min}
              max={priceRange.max}
              step={100000}
              value={priceSlider}
              onValueChange={(values) =>
                handlePriceSliderChange(values as [number, number])
              }
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Từ {priceSlider[0].toLocaleString()}₫</span>
              <span>Đến {priceSlider[1].toLocaleString()}₫</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="text-sm font-semibold flex items-center gap-2 mb-1">
            <Wifi className="w-4 h-4 text-primary" />
            Tiện nghi
          </label>
          <div className="flex flex-col gap-1">
            {loadingAmenities ? (
              <span>Đang tải...</span>
            ) : (
              amenities.map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={
                      filters.selectedAmenities?.includes(a.name) || false
                    }
                    onChange={() => toggleAmenity(a.name)}
                  />
                  {a.name}
                </label>
              ))
            )}
          </div>
        </div>

        {/* Search and Reset Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Tìm kiếm
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Xóa
          </Button>
        </div>
      </div>
    </aside>
  );
}
