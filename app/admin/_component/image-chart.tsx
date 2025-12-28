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

const data = [
  { month: "1月", images: 4500 },
  { month: "2月", images: 3200 },
  { month: "3月", images: 3100 },
  { month: "4月", images: 3700 },
  { month: "5月", images: 6200 },
  { month: "6月", images: 3300 },
  { month: "7月", images: 2900 },
  { month: "8月", images: 4100 },
  { month: "9月", images: 1700 },
  { month: "10月", images: 1800 },
  { month: "11月", images: 4700 },
  { month: "12月", images: 2100 },
];

// Pastel colors with low opacity (rgba)
const pastelColors = [
  "rgba(255, 230, 236, 0.7)", // very light pink
  "rgba(255, 205, 178, 0.7)", // very light orange
  "rgba(222, 237, 252, 0.7)", // very light blue
  "rgba(178, 235, 242, 0.7)", // very light cyan
  "rgba(178, 235, 242, 0.7)", // very light cyan (repeat for more pastel)
  "rgba(255, 249, 196, 0.7)", // very light yellow
  "rgba(232, 245, 233, 0.7)", // very light green
  "rgba(243, 207, 255, 0.7)", // very light purple
  "rgba(178, 223, 219, 0.7)", // very light teal
  "rgba(197, 225, 165, 0.7)", // very light lime
  "rgba(144, 202, 249, 0.7)", // very light blue
  "rgba(239, 154, 154, 0.7)", // very light red
];

export default function MonthlyImageBarChart() {
  return (
    <div className="bg-white rounded-lg p-4 shadow w-full h-[500px]">
      <h2 className="font-bold text-2xl mb-6 text-center">月間画像投稿数</h2>
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
          {/* No Tooltip */}
          <Bar dataKey="images">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={pastelColors[index % pastelColors.length]}
              />
            ))}
            <LabelList
              dataKey="images"
              position="top"
              style={{ fill: "#b0b0b0", fontWeight: 500, fontSize: 14 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
