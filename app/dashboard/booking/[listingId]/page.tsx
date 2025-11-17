"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import { createReservation } from "@/app/_actions/reservation/reservation-actions";
import { useSession } from "next-auth/react";

export default function BookingPage({
  params,
}: {
  // params may be a direct object or a Promise that resolves to the object
  params: { listingId: string } | Promise<{ listingId: string }>;
  searchParams: { roomId?: string };
}) {
  // <-- changed: unwrap params correctly in client component
  const listingParam = (params as { listingId: string }).listingId;
  const { data: session } = useSession();

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
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Support lookup by slug or numeric id (as string). Add/extend entries as needed.
  const hotelNames: { [key: string]: string } = {
    "1": "Hôtel Métropole Hà Nội",
    "2": "Riverside Resort Hội An",
    "3": "Phu Quoc Paradise",
    // add known slugs here
    "dn-family-villa": "DN Family Villa",
  };

  const roomPrices: { [key: string]: number } = {
    "1": 2500000,
    "2": 1800000,
    "3": 2200000,
    // add known slugs here
    "dn-family-villa": 2000000,
  };

  // Determine effective key: prefer slug (raw param). If it's numeric string, that will still work.
  const listingKey = listingParam;
  const hotelName = hotelNames[listingKey] ?? `Khách sạn ${listingParam}`;
  const pricePerNight = roomPrices[listingKey] ?? 2000000; // fallback price

  // Helper: format Date -> YYYYMMDD as number (Int[])
  const formatDateInt = (d: Date) => {
    return parseInt(d.toISOString().slice(0, 10).replace(/-/g, ""));
  };

  // Helper: generate reserved dates from checkIn (inclusive) to checkOut (exclusive)
  const getReservedDates = (checkInStr: string, checkOutStr: string) => {
    if (!checkInStr || !checkOutStr) return [] as number[];
    const arr: number[] = [];
    const cur = new Date(checkInStr);
    const end = new Date(checkOutStr);
    // normalize time to midnight to avoid DST issues
    cur.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    while (cur < end) {
      arr.push(formatDateInt(new Date(cur)));
      cur.setDate(cur.getDate() + 1);
    }
    return arr;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const nights = calculateNights();

    const reservationPayload = {
      listingId: listingKey,
      // <-- changed: prefer authenticated user id if available
      userId: session?.user?.id ?? "",
      startDate: formData.checkIn ? new Date(formData.checkIn) : new Date(),
      endDate: formData.checkOut ? new Date(formData.checkOut) : new Date(),
      chargeId: `local_${Math.random().toString(36).substr(2, 9)}`,
      daysDifference: nights,
      reservedDates: getReservedDates(formData.checkIn, formData.checkOut),
      specialRequests: formData.specialRequests || null,
    };

    try {
      // call server action to persist reservation and decrement roomsAvailable atomically
      await createReservation(reservationPayload);
      setBookingConfirmed(true);
      setSubmitting(false);

      setTimeout(() => {
        window.location.href = "/dashboard/mybookings";
      }, 2000);
    } catch (err: unknown) {
      console.error("Reservation error:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Đã xảy ra lỗi khi lưu đặt phòng";
      setErrorMsg(errMsg);
      setSubmitting(false);
    }
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
  const totalPrice = nights > 0 ? pricePerNight * nights : 0;

  // Prefill customer info from next-auth session (if available)
  useEffect(() => {
    if (!session?.user) return;
    const name = session.user.name ?? "";
    const parts = name.trim().split(/\s+/);
    const first = parts.length ? parts[0] : "";
    const last = parts.length > 1 ? parts.slice(1).join(" ") : "";

    setFormData((prev) => ({
      ...prev,
      // only fill when the field is currently empty to avoid overwriting user edits
      firstName: prev.firstName || first,
      lastName: prev.lastName || last,
      email: prev.email || session.user.email || "",
      // NOTE: do not attempt to read session.user.phone — phone isn't provided in session
      // phone stays as prev.phone so we don't overwrite or reference a nonexistent field
      phone: prev.phone,
    }));
  }, [session]);

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
          href={`/dashboard/listing/${listingKey}`}
          className="text-primary hover:underline mb-6 inline-block"
        >
          ← Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-2">Hoàn tất đặt phòng</h1>
              <p className="text-muted-foreground mb-8">{hotelName}</p>

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

                {errorMsg && (
                  <div className="text-sm text-red-600">{errorMsg}</div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                >
                  {submitting ? "Đang xử lý..." : "Xác nhận và thanh toán"}
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
                  <span className="font-medium">{hotelName}</span>
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
                  <span>{pricePerNight.toLocaleString("vi-VN")} ₫</span>
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
