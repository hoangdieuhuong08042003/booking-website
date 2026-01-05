import StatCard from "./_component/stat-card";
import { Users, Image } from "lucide-react";
import UserGrowthChart from "./_component/use-chart";
import MonthlyImageBarChart from "./_component/image-chart";
import { getListingCountByMonth } from "../_actions/listing/listing-actions";
import { getReservationCountByMonth } from "../_actions/reservation/reservation-actions";

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
  // Lấy dữ liệu thống kê
  const [listingStats, reservationStats] = await Promise.all([
    getListingCountByMonth(),
    getReservationCountByMonth(),
  ]);
  const monthLabels = getMonthLabels();

  const listingChartData = monthLabels.map((label, idx) => ({
    month: label,
    count: listingStats[idx]?.count ?? 0,
  }));

  const reservationChartData = monthLabels.map((label, idx) => ({
    month: label,
    count: reservationStats[idx]?.count ?? 0,
  }));

  return (
    <main className="flex flex-col items-center w-full min-h-screen ">
      <div className="w-full p-4 mt-12 space-y-4">
        <h1 className="text-5xl font-bold">Thống kê tổng quan</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Xem nhanh hiệu suất hệ thống và tiến độ đạt mục tiêu.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <StatCard
            title="Tổng số chỗ lưu trú "
            value={listingChartData
              .reduce((sum, d) => sum + d.count, 0)
              .toLocaleString()}
            icon={<Users className="text-blue-500" />}
          />
          <StatCard
            title="Tổng số lượt đặt phòng"
            value={reservationChartData
              .reduce((sum, d) => sum + d.count, 0)
              .toLocaleString()}
            icon={<Image className="text-purple-400" />}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          <UserGrowthChart
            data={listingChartData}
            title="Số lượng chỗ lưu trú  theo tháng"
            label="Chỗ lưu trú "
          />
          <MonthlyImageBarChart
            data={reservationChartData}
            title="Số lượng đặt phòng theo tháng"
            label="Đặt phòng"
          />
        </div>
      </div>
    </main>
  );
}
