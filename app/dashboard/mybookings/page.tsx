import { DashboardHeader } from "@/app/_components/dashboard-header";
import Link from "next/link";
import { Calendar, DollarSign, ChevronRight } from "lucide-react";
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
          <div className="space-y-3 max-w-6xl justify-center mx-auto">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/dashboard/mybookings/${booking.id}`}
                className="block group"
              >
                <div className="bg-card border border-border rounded-lg p-5 hover:shadow-md hover:border-primary/50 transition-all duration-200">
                  {/* List Item Header - Title and ID */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate">
                        {booking.listing?.name ?? booking.listingId}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Booking ID: {booking.id}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                  </div>

                  {/* List Item Details - Grid for responsive layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Check-in/Check-out Dates */}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">
                          Thời gian lưu trú
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(booking.startDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.endDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Night Count */}
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">
                          Số đêm
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {Math.ceil(
                            (new Date(booking.endDate).getTime() -
                              new Date(booking.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          đêm
                        </p>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">
                          Tổng tiền
                        </p>
                        <p className="text-sm font-bold text-primary">
                          {booking.totalPrice.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
