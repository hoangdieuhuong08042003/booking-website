export const dynamic = "force-dynamic";

import UserGrowthChart from "./_component/use-chart";
import { getReservationCountByMonth } from "../_actions/reservation/reservation-actions";
import { FaRegImage } from "react-icons/fa";

function getMonthLabels() {
  return [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
}

export default async function AdminPage() {
  const reservationStats = await getReservationCountByMonth();
  const monthLabels = getMonthLabels();

  const reservationChartData = monthLabels.map((label, idx) => ({
    month: label,
    count: reservationStats[idx]?.count ?? 0,
  }));

  const totalReservations = reservationChartData.reduce(
    (sum, d) => sum + d.count,
    0
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Thống kê tổng quan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Xem tổng quan các thống kê về đặt phòng
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start rounded-lg border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FaRegImage className="text-lg text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Tổng số lượt đặt phòng
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {totalReservations.toLocaleString()}
            </p>
          </div>

          {/* Additional Stats Cards (Placeholders) */}
          <div className="flex flex-col items-start rounded-lg border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ✓
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Đặt phòng thành công
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>

          <div className="flex flex-col items-start rounded-lg border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                ⏳
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Đang chờ xử lý
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>

          <div className="flex flex-col items-start rounded-lg border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <span className="text-lg font-bold text-destructive">✕</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Hủy bỏ</p>
            <p className="mt-2 text-2xl font-bold text-foreground">0</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="rounded-lg border border-border/50 bg-card p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Số lượng đặt phòng theo tháng
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Biểu đồ thống kê đặt phòng hàng tháng
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <UserGrowthChart
              data={reservationChartData}
              title=""
              label="Đặt phòng"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
