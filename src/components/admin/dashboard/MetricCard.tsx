import React from "react";
import { ArrowUpRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, bg }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-orange-500 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110 duration-300`}>
        {React.cloneElement(icon as React.ReactElement, { size: 22 })}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white leading-tight mt-0.5">{value ?? 0}</h2>
      </div>
    </div>
  </div>
);