import { DashboardHeader } from "@/app/_components/dashboard-header";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { getBookingsByUser } from "@/app/_actions/reservation/reservation-actions";
import { getUserId } from "@/app/_actions/user/get-user";
import type { Reservation } from "@prisma/client";

type BookingWithListing = Reservation & {
  listing?: { name?: string | null } | null;
};

export default async function BookingsPage() {
  // server-side: get current user and their reservations
  const userId = await getUserId();
  const bookings: BookingWithListing[] = userId
    ? await getBookingsByUser(userId)
    : [];

  if (!userId) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">
            Vui lòng đăng nhập để xem booking của bạn.
          </p>
          <Link href="/api/auth/signin">
            <button className="mt-4 btn-primary">Đăng nhập</button>
          </Link>
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
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded">
                Tìm kiếm khách sạn
              </button>
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
                      {booking.listing?.name ?? booking.listingId}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Thời gian lưu trú
                      </p>
                      <p className="font-medium">
                        {new Date(booking.startDate).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                        →{" "}
                        {new Date(booking.endDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">
                      Tổng tiền
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      {booking.status}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-2">
                  <div className="text-sm text-muted-foreground flex-1">
                    <span className="font-medium text-foreground">
                      {/* show user info if available */}
                    </span>
                  </div>
                  {/* Hủy booking có thể được thêm sau bằng server action */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
