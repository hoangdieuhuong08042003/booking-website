"use client";

import {
  Calendar,
  MapPin,
  Bed,
  Star,
  Phone,
  FileText,
  CreditCard,
} from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { cancelReservation } from "@/app/_actions/reservation/reservation-actions";
import { Reservation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import ReviewPrompt from "./review-prompt";

const statusTranslations = {
  ACTIVE: "Đang hoạt động",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
  BLOCKED: "Bị chặn",
};

export default function BookingDetailClient({
  booking,
}: {
  booking: Reservation & {
    listing: {
      name: string;
      type: string;
      desc: string;
      pricePerNight: number;
      beds: number;
      roomsAvailable: number;
      imageUrls: string[];
      thumbnail: string;

      avgRating: number;
      roomType: { name: string } | null;
      province: { name: string } | null;
      ward: { name: string } | null;
    } | null;
    user: {
      name: string | null;
      email: string;
    };
  };
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // State để mở dialog review
  const [openReview, setOpenReview] = useState(false);

  // State để hiển thị thông báo thành công
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    BLOCKED: "bg-gray-100 text-gray-800",
  };

  const canCancelWithin24Hours = () => {
    const now = new Date();
    const createdAt = new Date(booking.createdAt);
    const timeDiff = now.getTime() - createdAt.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff <= 24;
  };

  const handleCancel = async () => {
    if (!canCancelWithin24Hours()) {
      setError("Bạn chỉ có thể hủy đặt phòng trong vòng 24 giờ.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Process Refund via Stripe
      await axios.delete(
        `/api/stripe?charge_id=${booking.chargeId}&reservation_id=${booking.id}`
      );

      // 2. Mark as Cancelled in DB
      await cancelReservation(booking.id);
      setCancelled(true);
      setOpenConfirmDialog(false);
      setSuccessMessage("Đặt phòng đã được hủy thành công.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Hủy đặt phòng không thành công. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Callback khi review thành công
  const handleReviewSuccess = () => {
    setSuccessMessage("Cảm ơn bạn đã đánh giá!");
    setOpenReview(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Dialog thông báo thành công */}
      <Dialog
        open={!!successMessage}
        onOpenChange={(open) => {
          if (!open) setSuccessMessage(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Thành công</DialogTitle>
            <DialogDescription>{successMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setSuccessMessage(null)}>Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Header */}
      <div className="bg-primary/5 p-6 border-b border-border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chi tiết đặt phòng</h1>
            <p className="text-muted-foreground">Booking ID: {booking.id}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              statusColors[booking.status]
            }`}
          >
            {statusTranslations[booking.status]}
          </span>
        </div>
      </div>

      {/* Guest Information */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold mb-4">Thông tin khách hàng</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Tên:</span>{" "}
            {booking.user.name ?? "N/A"}
          </p>
          <p>
            <span className="font-medium">Email:</span> {booking.user.email}
          </p>
        </div>
      </div>

      {/* Listing Information */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold mb-4">Thông tin khách sạn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {booking.listing?.thumbnail && (
              <Image
                src={booking.listing.thumbnail}
                alt={booking.listing.name}
                width={300}
                height={200}
                className="rounded-lg w-full h-48 object-cover"
              />
            )}
          </div>
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-2xl font-bold">
              {booking.listing?.name ?? "N/A"}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>
                {booking.listing?.ward?.name}, {booking.listing?.province?.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-accent" />
                <span>{booking.listing?.beds} giường</span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{booking.listing?.avgRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Loại phòng:</p>
              <p>{booking.listing?.roomType?.name ?? booking.listing?.type}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Mô tả:</p>
              {/* Hiển thị mô tả theo định dạng HTML */}
              <div
                className="line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: booking.listing?.desc || "",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold mb-4">Thông tin đặt phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-medium mb-1">Ngày nhận phòng</p>
                <p className="text-muted-foreground">
                  {new Date(booking.startDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-medium mb-1">Ngày trả phòng</p>
                <p className="text-muted-foreground">
                  {new Date(booking.endDate).toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-medium mb-1">Số ngày lưu trú</p>
                <p className="text-muted-foreground">
                  {booking.daysDifference} đêm
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-medium mb-1">Số điện thoại</p>
                <p className="text-muted-foreground">{booking.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-medium mb-1">Mã thanh toán</p>
                <p className="text-muted-foreground font-mono text-sm">
                  {booking.chargeId}
                </p>
              </div>
            </div>
            {booking.specialRequests && (
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="font-medium mb-1">Yêu cầu đặc biệt</p>
                  <p className="text-muted-foreground">
                    {booking.specialRequests}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="p-6 bg-primary/5">
        <div className="max-w-md ml-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Giá mỗi đêm (
              {booking.listing?.pricePerNight.toLocaleString("vi-VN")} ₫)
            </span>
            <span className="font-medium">
              {booking.listing?.pricePerNight.toLocaleString("vi-VN")} ₫
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Số đêm</span>
            <span className="font-medium">{booking.daysDifference}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="text-lg font-semibold">Tổng tiền</span>
            <span className="text-2xl font-bold text-red-500">
              {booking.totalPrice.toLocaleString("vi-VN")} ₫
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Booking Section */}
      {booking.status === "ACTIVE" && (
        <div className="p-6 border-t border-border bg-orange-50">
          {error && <p className="text-red-500 mb-4 ">{error}</p>}
          {cancelled ? (
            <p className="text-green-600">Đặt phòng đã được hủy thành công.</p>
          ) : (
            <div className="flex justify-end">
              <Button
                onClick={() => setOpenConfirmDialog(true)}
                disabled={!canCancelWithin24Hours()}
                variant="destructive"
                size="lg"
              >
                Hủy đặt phòng
              </Button>
            </div>
          )}
          {!canCancelWithin24Hours() && (
            <p className="text-sm text-gray-600 mt-2">
              Chỉ có thể hủy đặt phòng trong vòng 24 giờ kể từ khi đặt.
            </p>
          )}
        </div>
      )}

      {/* Button viết review */}
      {booking.status === "COMPLETED" && (
        <div className="p-6 border-t border-border bg-blue-50 flex justify-end">
          <Button
            variant="default"
            size="lg"
            onClick={() => setOpenReview(true)}
          >
            Viết đánh giá
          </Button>
          {/* Dialog viết review */}
          {openReview && (
            <ReviewPrompt
              booking={{
                id: booking.id,
                status: booking.status,
              }}
              open={openReview}
              setOpen={setOpenReview}
              onSuccess={handleReviewSuccess}
            />
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đặt phòng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đặt phòng này không? Hành động này không
              thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setOpenConfirmDialog(false)}
              variant="outline"
              disabled={loading}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleCancel}
              variant="destructive"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận hủy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
