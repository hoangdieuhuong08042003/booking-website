import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="flex flex-row items-center bg-white dark:bg-gray-900 rounded-xl shadow p-6 w-full h-24 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col justify-center flex-1 h-full">
        <span className="text-sm text-gray dark:text-gray-400">{title}</span>
        <div className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
      </div>
      {icon && (
        <span className="text-3xl flex items-center justify-center mr-4 h-12 w-12">
          {icon}
        </span>
      )}
    </div>
  );
}
