"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Wifi,
  Utensils,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DashboardHeader } from "@/app/_components/dashboard-header";

const allHotels = [
  {
    id: 1,
    name: "Hôtel Métropole Hà Nội",
    location: "Hà Nội, Việt Nam",
    rating: 4.8,
    price: 2500000,
    image: "/luxury-hotel-hanoi-palace-elegant.jpg",
    reviews: 324,
    amenities: ["WiFi miễn phí", "Hồ bơi", "Phòng gym", "Nhà hàng"],
    description:
      "Khách sạn 5 sao hàng đầu tại Hà Nội với kiến trúc cổ điển sang trọng, dịch vụ hàng đầu và vị trí trung tâm thành phố.",
    fullAmenities: [
      "WiFi miễn phí",
      "Hồ bơi ngoài trời",
      "Phòng gym 24/7",
      "Nhà hàng đạt sao Michelin",
      "Spa cao cấp",
      "Dịch vụ phòng 24/7",
      "Business center",
      "Vườn cây xanh",
    ],
    rooms: [
      {
        id: 1,
        name: "Phòng Tiêu chuẩn",
        capacity: 2,
        price: 2500000,
        bedType: "Giường đôi",
      },
      {
        id: 2,
        name: "Phòng Deluxe",
        capacity: 2,
        price: 3200000,
        bedType: "Giường đôi king",
      },
      {
        id: 3,
        name: "Suite",
        capacity: 4,
        price: 5500000,
        bedType: "Giường đôi + sofa",
      },
    ],
  },
  {
    id: 2,
    name: "Riverside Resort Hội An",
    location: "Hội An, Việt Nam",
    rating: 4.6,
    price: 1800000,
    image: "/luxury-hotel-hoi-an-riverside-traditional.jpg",
    reviews: 287,
    amenities: ["Bãi biển riêng", "Spa", "WiFi miễn phí", "Nhà hàng"],
    description:
      "Resort ven sông tuyệt đẹp ở Hội An, kết hợp kiến trúc truyền thống với tiện nghi hiện đại.",
    fullAmenities: [
      "WiFi miễn phí",
      "Bãi biển riêng",
      "Spa quốc tế",
      "Nhà hàng địa phương",
      "Bàn trà",
      "Phòng yoga",
      "Xe đưa đón",
      "Lễ tân 24/7",
    ],
    rooms: [
      {
        id: 1,
        name: "Phòng Tiêu chuẩn",
        capacity: 2,
        price: 1800000,
        bedType: "Giường đôi",
      },
      {
        id: 2,
        name: "Phòng Ven sông",
        capacity: 2,
        price: 2400000,
        bedType: "Giường đôi king",
      },
      {
        id: 3,
        name: "Villa",
        capacity: 4,
        price: 4200000,
        bedType: "Giường đôi + phòng ngủ thứ 2",
      },
    ],
  },
  {
    id: 3,
    name: "Phu Quoc Paradise",
    location: "Phú Quốc, Việt Nam",
    rating: 4.7,
    price: 2200000,
    image: "/luxury-resort-phu-quoc-beach-tropical.jpg",
    reviews: 456,
    amenities: ["Bãi biển riêng", "Hồ bơi", "Yoga", "Nhà hàng"],
    description:
      "Resort nghỉ dưỡng hàng đầu tại Phú Quốc với bãi biển trắng mịn và tiêu chuẩn quốc tế.",
    fullAmenities: [
      "Bãi biển riêng",
      "Hồ bơi vô cực",
      "Lớp yoga buổi sáng",
      "Nhà hàng seafood",
      "Bar bãi biển",
      "Câu cá",
      "Lặn biển",
      "Xe máy cho thuê",
    ],
    rooms: [
      {
        id: 1,
        name: "Phòng Tiêu chuẩn",
        capacity: 2,
        price: 2200000,
        bedType: "Giường đôi",
      },
      {
        id: 2,
        name: "Phòng Bãi biển",
        capacity: 2,
        price: 3500000,
        bedType: "Giường đôi king",
      },
      {
        id: 3,
        name: "Villa Riêng",
        capacity: 4,
        price: 6500000,
        bedType: "2 Giường ngủ",
      },
    ],
  },
];

export default function HotelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const hotel = allHotels.find((h) => h.id === parseInt(params.id));
  const [selectedRoom, setSelectedRoom] = useState(hotel?.rooms[0]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Khách sạn không tìm thấy</h1>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={hotel.image || "/placeholder.svg"}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hotel Info */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {hotel.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="text-xl font-semibold">{hotel.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({hotel.reviews} đánh giá)
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {hotel.location}
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              {hotel.description}
            </p>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Tiện nghi</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hotel.fullAmenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-secondary rounded"
                  >
                    {amenity.includes("WiFi") && <Wifi className="w-4 h-4" />}
                    {amenity.includes("nhà hàng") ||
                      (amenity.includes("Nhà hàng") && (
                        <Utensils className="w-4 h-4" />
                      ))}
                    {amenity.includes("gym") && (
                      <Dumbbell className="w-4 h-4" />
                    )}
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rooms Selection */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Chọn loại phòng</h2>
              <div className="space-y-3">
                {hotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedRoom?.id === room.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {room.bedType}
                        </p>
                      </div>
                      <span className="text-xl font-bold text-accent">
                        {room.price.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tối đa {room.capacity} khách
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Chi tiết đặt phòng</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Loại phòng
                  </p>
                  <p className="font-semibold">{selectedRoom?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Giá mỗi đêm
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    {selectedRoom?.price.toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>

              <Link
                href={`/dashboard/booking/${hotel.id}?roomId=${selectedRoom?.id}`}
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg">
                  Tiếp tục đặt phòng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
