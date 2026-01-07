"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type UserGrowthChartProps = {
  data: { month: string; count: number }[];
  title?: string;
  label?: string;
};

export default function UserGrowthChart({
  data,
  title = "Số lượng nhà nghỉ theo tháng",
  label = "Nhà nghỉ",
}: UserGrowthChartProps) {
  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-sky-100 dark:from-sky-900 dark:via-gray-950 dark:to-sky-900 rounded-3xl p-8 shadow-2xl w-full h-[500px] border border-sky-200 dark:border-sky-800 flex flex-col justify-between">
      <h2 className="font-extrabold text-3xl mb-8 text-center text-sky-700 dark:text-sky-200 tracking-tight drop-shadow-lg">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#bae6fd"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 15, fill: "#0ea5e9", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            type="number"
            allowDataOverflow={true}
            tick={{ fontSize: 15, fill: "#0ea5e9", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="url(#colorLine)"
            strokeWidth={4}
            dot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 3, fill: "#fff" }}
            activeDot={{
              r: 10,
              fill: "#0ea5e9",
              stroke: "#fff",
              strokeWidth: 3,
              filter: "drop-shadow(0 0 6px #0ea5e9)",
            }}
            connectNulls
            name={label}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-center mt-4 text-sm text-sky-600 dark:text-sky-300 italic">
        Biểu đồ trực quan hóa dữ liệu {label.toLowerCase()} theo tháng
      </div>
    </div>
  );
}
