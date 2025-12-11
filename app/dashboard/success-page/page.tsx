"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SuccessPage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      setOpen(false);
      router.replace("/dashboard/mybookings");
    }, 2000);
    return () => clearTimeout(timer);
  }, [open, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán thành công!</DialogTitle>
          <DialogDescription>
            Cảm ơn bạn đã đặt phòng. Đang chuyển về trang booking của bạn...
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
