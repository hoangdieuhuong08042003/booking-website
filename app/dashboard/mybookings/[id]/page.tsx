import { DashboardHeader } from "@/app/_components/dashboard-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingById } from "@/app/_actions/reservation/reservation-actions";
import BookingDetailClient from "./booking-detail-client";
import ReviewPrompt from "./review-prompt";

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = await getBookingById(params.id);

  if (!booking) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard/mybookings"
            className="text-primary hover:underline text-sm"
          >
            ← Quay lại danh sách booking
          </Link>
        </div>
        <BookingDetailClient booking={booking} />
        <ReviewPrompt booking={booking} />
      </div>
    </main>
  );
}
