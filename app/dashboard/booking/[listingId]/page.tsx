"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  Users,
  Phone,
} from "lucide-react";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import { useSession } from "next-auth/react";
import { redirectToCheckout } from "@/app/_utils/stripeService";
import { useSearchParams, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function BookingPage() {
  // read dynamic segment + query params from client router
  const params = useParams() as { listingId?: string };
  const searchParams = useSearchParams();
  const listingId = params?.listingId ?? "unknown";

  const rawPrice = searchParams?.get("price");
  const rawName = searchParams?.get("name");
  const rawBeds = searchParams?.get("beds");

  const pricePerNight = Number(rawPrice);
  const hotelName = rawName
    ? decodeURIComponent(rawName)
    : `Khách sạn ${listingId}`;

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

  const [bookingConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Lấy số giường từ query string, fallback 1 nếu không có
  const beds = Number(rawBeds);

  const maxGuests = beds * 2;
  const isGuestsValid = formData.guests <= maxGuests;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Tính ngày min cho checkout (ngày checkin + 1)
  const getMinCheckoutDate = () => {
    if (!formData.checkIn) return today;
    const checkInDate = new Date(formData.checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    return checkInDate.toISOString().split("T")[0];
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const check_in = new Date(formData.checkIn);
    const check_out = new Date(formData.checkOut);
    // Ensure check_out > check_in
    if (check_out <= check_in) return 0;
    return Math.ceil(
      (check_out.getTime() - check_in.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const nights = calculateNights();
  const totalPrice = nights > 0 ? pricePerNight * nights : 0;

  useEffect(() => {
    if (!session?.user) return;
    const name = session.user.name ?? "";
    const parts = name.trim().split(/\s+/);
    const first = parts.length ? parts[0] : "";
    const last = parts.length > 1 ? parts.slice(1).join(" ") : "";

    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || first,
      lastName: prev.lastName || last,
      email: prev.email || session.user.email || "",
      phone: prev.phone,
    }));
  }, [session]);

  // Validate check-in/check-out logic
  const isDateValid =
    formData.checkIn &&
    formData.checkOut &&
    new Date(formData.checkOut) > new Date(formData.checkIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate guests vs beds before submit
    if (!isGuestsValid) {
      setErrorMsg(
        `Số lượng khách vượt quá số giường (${maxGuests} khách tối đa).`
      );
      return;
    }

    setSubmitting(true);

    const nightsCount = calculateNights();

    try {
      const listingData = {
        name: hotelName,
        pricePerNight: pricePerNight,
        id: listingId,
      };

      await redirectToCheckout(
        listingData,
        formData.checkIn ? new Date(formData.checkIn) : new Date(),
        formData.checkOut ? new Date(formData.checkOut) : new Date(),
        nightsCount,
        formData.phone,
        formData.specialRequests,
        formData.guests
      );

      setSubmitting(false); // In case redirect fails or is slow
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

  if (bookingConfirmed) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardHeader />
        <Dialog open={bookingConfirmed} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <DialogTitle className="text-center text-2xl">
                Đặt phòng thành công!
              </DialogTitle>
              <DialogDescription className="text-center">
                Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">
                      Check-in → Check-out
                    </p>
                    <p className="font-medium">
                      {formData.checkIn} → {formData.checkOut}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Số khách</p>
                    <p className="font-medium">{formData.guests} người</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-muted-foreground text-xs">Liên hệ</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Tổng thanh toán
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {totalPrice.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => (window.location.href = "/dashboard/mybookings")}
                className="w-full"
              >
                Xem booking của tôi
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard")}
                className="w-full"
              >
                Về trang chủ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/dashboard/listing/${listingId}`}
          className="text-primary hover:underline mb-6 inline-block"
        >
          ← Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-2">Hoàn tất đặt phòng</h1>
              <p className="text-muted-foreground mb-1">{hotelName}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Check-in/Check-out */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nhận phòng (Check-in)
                    </label>
                    <Input
                      type="date"
                      required
                      min={today}
                      value={formData.checkIn}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          checkIn: e.target.value,
                          checkOut: "",
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Trả phòng (Check-out)
                    </label>
                    <Input
                      type="date"
                      required
                      min={getMinCheckoutDate()}
                      value={formData.checkOut}
                      onChange={(e) =>
                        setFormData({ ...formData, checkOut: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số lượng khách
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={maxGuests}
                    required
                    value={formData.guests}
                    onChange={(e) => {
                      let val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) val = 1;
                      if (val > maxGuests) val = maxGuests;
                      setFormData({
                        ...formData,
                        guests: val,
                      });
                    }}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Tối đa {maxGuests} khách (2 khách/giường)
                  </div>
                </div>

                {/* Guest Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin khách hàng
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Họ"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                    <Input
                      type="text"
                      placeholder="Tên"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Input
                    type="tel"
                    placeholder="Số điện thoại"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Yêu cầu đặc biệt (Tùy chọn)
                  </label>
                  <Textarea
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialRequests: e.target.value,
                      })
                    }
                    placeholder="Ví dụ: Yêu cầu phòng cao tầng, tặng sinh nhật..."
                    rows={4}
                  />
                </div>

                {errorMsg && (
                  <div className="text-sm text-red-600">{errorMsg}</div>
                )}
                {!isGuestsValid && (
                  <div className="text-sm text-red-600">
                    Số lượng khách vượt quá số giường ({maxGuests} khách tối
                    đa).
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || !isDateValid || !isGuestsValid}
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số giường</span>
                  <span className="font-medium">{beds}</span>
                </div>
              </div>

              <div className="pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-red-600">
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
