"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import Link from "next/link";

interface Booking {
  id: string;
  hotelName: string;
  hotelId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalPrice: number;
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);
    setLoading(false);
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Bạn có chắc muốn hủy booking này?")) {
      const updatedBookings = bookings.filter((b) => b.id !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Các booking của tôi</h1>
        <p className="text-muted-foreground mb-8">
          Quản lý và xem lại các đặt phòng của bạn
        </p>

        {bookings.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Chưa có booking nào</h2>
            <p className="text-muted-foreground mb-6">
              Hãy đặt phòng khách sạn yêu thích của bạn ngay bây giờ
            </p>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Tìm kiếm khách sạn
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {booking.hotelName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày đặt</p>
                      <p className="font-medium">{booking.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Thời gian lưu trú
                      </p>
                      <p className="font-medium">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Tổng tiền
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      {booking.totalPrice.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-2">
                  <div className="text-sm text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">
                      {booking.firstName} {booking.lastName}
                    </span>{" "}
                    • {booking.phone}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hủy booking
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
