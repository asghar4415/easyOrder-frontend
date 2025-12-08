import React from "react";
import { OrderStatus } from "@/types/order";

interface OrderFilterProps {
  currentFilter: OrderStatus | "ALL";
  onFilterChange: (filter: OrderStatus | "ALL") => void;
  counts: Record<string, number>;
}

const filters: { label: string; value: OrderStatus | "ALL" }[] = [
  { label: "All Orders", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Preparing", value: "PREPARING" },
    { label: "Ready", value: "READY" },

    { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
];

export default function OrderFilter({ currentFilter, onFilterChange, counts }: OrderFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
            currentFilter === filter.value
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/5"
          }`}
        >
          {filter.label} 
          <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
             currentFilter === filter.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          }`}>
            {counts[filter.value] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}