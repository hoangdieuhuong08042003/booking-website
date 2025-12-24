"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "1月", users: 500 },
  { month: "2月", users: null },
  { month: "3月", users: 900 },
  { month: "4月", users: null },
  { month: "5月", users: 1300 },
  { month: "6月", users: null },
  { month: "7月", users: 1700 },
  { month: "8月", users: null },
  { month: "9月", users: 1900 },
  { month: "10月", users: null },
  { month: "11月", users: null },
  { month: "12月", users: 2100 },
];

export default function UserGrowthChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow w-full h-[500px] border border-[#f2f4f7]">
      <h2 className="font-bold text-2xl mb-6 text-center">
        ユーザー成長トレンド
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            domain={[500, 2100]}
            allowDataOverflow={true}
            tick={{ fontSize: 14 }}
            axisLine={false}
            tickLine={false}
            ticks={[500, 900, 1300, 1700, 2100]}
          />
          {/* Không có Tooltip */}
          <Line
            type="monotone"
            dataKey="users"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#fff" }}
            activeDot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
