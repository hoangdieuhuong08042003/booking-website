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
    <div className="bg-white rounded-xl p-6 shadow w-full h-[500px] border border-[#f2f4f7]">
      <h2 className="font-bold text-2xl mb-6 text-center">{title}</h2>
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
            allowDataOverflow={true}
            tick={{ fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#fff" }}
            activeDot={false}
            connectNulls
            name={label}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
