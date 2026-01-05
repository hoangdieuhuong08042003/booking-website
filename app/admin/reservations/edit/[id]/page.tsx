"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  adminGetReservationById,
  adminUpdateReservation,
} from "@/app/_actions/reservation/reservation-actions";
import { ReservationStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Định nghĩa type dựa trên schema Prisma
type ReservationWithRelations = {
  id: string;
  status: ReservationStatus;
  phone: string;
  specialRequests?: string | null;
  user?: { name?: string | null };
  listing?: { name?: string | null };
  // ...các trường khác nếu cần
};

const statusOptions = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "CANCELLED", label: "CANCELLED" },
  { value: "BLOCKED", label: "BLOCKED" },
  { value: "COMPLETED", label: "COMPLETED" },
];

export default function EditReservationPage() {
  const { id } = useParams();
  const router = useRouter();
  const reservationId = Array.isArray(id) ? id[0] : id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reservation, setReservation] =
    useState<ReservationWithRelations | null>(null);
  const [status, setStatus] = useState<ReservationStatus | "">("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    if (!reservationId) return;
    setLoading(true);
    adminGetReservationById(reservationId)
      .then((res) => {
        setReservation(res);
        setStatus(res?.status ?? "");
        setPhone(res?.phone ?? "");
        setSpecialRequests(res?.specialRequests ?? "");
      })
      .finally(() => setLoading(false));
  }, [reservationId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateReservation(reservationId, {
        status: status as ReservationStatus,
        phone,
        specialRequests,
      });
      toast.success("Cập nhật reservation thành công!");
      router.back();
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Đang tải...</div>;
  if (!reservation)
    return <div className="p-8">Không tìm thấy reservation</div>;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white rounded-xl mt-24 p-4 shadow dark:bg-[#3A3A3A]">
      <div className="max-w-xl mx-auto">
        <h1 className="text-lg font-bold mb-4">Chỉnh sửa Reservation</h1>
        <div className="mb-4">
          <Label>ID</Label>
          <Input value={reservation.id} disabled />
        </div>
        <div className="mb-4">
          <Label>Khách</Label>
          <Input value={reservation.user?.name || ""} disabled />
        </div>
        <div className="mb-4">
          <Label>Listing</Label>
          <Input value={reservation.listing?.name || ""} disabled />
        </div>
        <div className="mb-4">
          <Label>Trạng thái</Label>
          <select
            className="w-full border rounded px-2 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as ReservationStatus)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <Label>SĐT</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="mb-4">
          <Label>Ghi chú</Label>
          <Input
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Quay lại
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
