"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createReviewFromReservation } from "@/app/_actions/review/review-actions";

type BookingForReview = {
  id: string;
  status?: string;
  listingId?: string;
  listing?: { id: string; name?: string };
};

type ReviewPromptProps = {
  booking: BookingForReview;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export default function ReviewPrompt({
  booking,
  open,
  setOpen,
}: ReviewPromptProps) {
  const [stars, setStars] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!booking?.id) return null;

  const submit = () =>
    startTransition(async () => {
      setError(null);
      try {
        await createReviewFromReservation({
          reservationId: booking.id,
          text,
          stars,
        });
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gửi đánh giá thất bại");
      }
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá phòng</DialogTitle>
          <DialogDescription>
            {booking.listing?.name ?? "Phòng"} đã hoàn thành, hãy để lại cảm
            nhận của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Số sao (1-5)</label>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setStars(num)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      num <= stars
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Chia sẻ trải nghiệm của bạn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button disabled={pending} onClick={submit}>
            {pending ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
