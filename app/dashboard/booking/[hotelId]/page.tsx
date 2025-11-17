"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Users, AlertCircle } from "lucide-react";
import { DashboardHeader } from "@/app/_components/dashboard-header";

export default function BookingPage({
  params,
  searchParams,
}: {
  params: { hotelId: string };
  searchParams: { roomId?: string };
}) {
  const hotelId = parseInt(params.hotelId);
  const roomId = parseInt(searchParams.roomId || "1");

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const hotelNames: { [key: number]: string } = {
    1: "Hôtel Métropole Hà Nội",
    2: "Riverside Resort Hội An",
    3: "Phu Quoc Paradise",
  };

  const roomPrices: { [key: number]: number } = {
    1: 2500000,
    2: 1800000,
    3: 2200000,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);

    // Store booking to localStorage (can replace with API later)
    const booking = {
      id: Math.random().toString(36).substr(2, 9),
      hotelId,
      hotelName: hotelNames[hotelId],
      roomId,
      ...formData,
      totalPrice: roomPrices[hotelId] * calculateNights(),
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    setTimeout(() => {
      window.location.href = "/dashboard/bookings";
    }, 2000);
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const check_in = new Date(formData.checkIn);
    const check_out = new Date(formData.checkOut);
    return Math.ceil(
      (check_out.getTime() - check_in.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();
  const totalPrice = nights > 0 ? roomPrices[hotelId] * nights : 0;

  if (bookingConfirmed) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <DashboardHeader />
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold mb-2">Đặt phòng thành công!</h1>
          <p className="text-muted-foreground mb-6">
            Chuyển hướng đến danh sách booking của bạn...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/dashboard/hotel/${hotelId}`}
          className="text-primary hover:underline mb-6 inline-block"
        >
          ← Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-2">Hoàn tất đặt phòng</h1>
              <p className="text-muted-foreground mb-8">
                {hotelNames[hotelId]}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Check-in/Check-out */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nhận phòng (Check-in)
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.checkIn}
                      onChange={(e) =>
                        setFormData({ ...formData, checkIn: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Trả phòng (Check-out)
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.checkOut}
                      onChange={(e) =>
                        setFormData({ ...formData, checkOut: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số lượng khách
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.guests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guests: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Guest Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin khách hàng
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Họ"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Tên"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Yêu cầu đặc biệt (Tùy chọn)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialRequests: e.target.value,
                      })
                    }
                    placeholder="Ví dụ: Yêu cầu phòng cao tầng, tặng sinh nhật..."
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                >
                  Xác nhận và thanh toán
                </Button>
              </form>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Tóm tắt đặt phòng</h3>

              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Khách sạn</span>
                  <span className="font-medium">{hotelNames[hotelId]}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-in</span>
                  <span>{formData.checkIn || "Chưa chọn"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Check-out</span>
                  <span>{formData.checkOut || "Chưa chọn"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số đêm</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giá/đêm</span>
                  <span>{roomPrices[hotelId].toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>

              <div className="pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-accent">
                    {totalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              <div className="bg-secondary/30 border border-secondary rounded-lg p-3 flex gap-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Không tính phí hủy miễn phí trong 24 giờ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
