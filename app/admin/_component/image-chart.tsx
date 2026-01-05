"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const pastelColors = [
  "rgba(255, 230, 236, 0.7)",
  "rgba(255, 205, 178, 0.7)",
  "rgba(222, 237, 252, 0.7)",
  "rgba(178, 235, 242, 0.7)",
  "rgba(178, 235, 242, 0.7)",
  "rgba(255, 249, 196, 0.7)",
  "rgba(232, 245, 233, 0.7)",
  "rgba(243, 207, 255, 0.7)",
  "rgba(178, 223, 219, 0.7)",
  "rgba(197, 225, 165, 0.7)",
  "rgba(144, 202, 249, 0.7)",
  "rgba(239, 154, 154, 0.7)",
];

type MonthlyImageBarChartProps = {
  data: { month: string; count: number }[];
  title?: string;
  label?: string;
};

export default function MonthlyImageBarChart({
  data,
  title = "Số lượng đặt phòng theo tháng",
  label = "Đặt phòng",
}: MonthlyImageBarChartProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow w-full h-[500px]">
      <h2 className="font-bold text-2xl mb-6 text-center">{title}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={38}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 14 }}
            padding={{ left: 20, right: 20 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 14 }} axisLine={false} tickLine={false} />
          <Bar dataKey="count" name={label}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={pastelColors[index % pastelColors.length]}
              />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              style={{ fill: "#b0b0b0", fontWeight: 500, fontSize: 14 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
