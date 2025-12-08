"use client";
import React from "react";
import { Order, OrderStatus } from "@/types/order";
import Badge from "@/components/ui/badge/Badge";

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export default function KitchenOrderCard({ order, onUpdateStatus }: KitchenOrderCardProps) {
  
  // Helper to calculate time ago (e.g., "5 mins ago")
  const getTimeElapsed = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  const isCooking = order.status === "PREPARING";

  return (
    <div className={`flex flex-col h-full bg-white border rounded-xl shadow-sm dark:bg-gray-900 dark:border-gray-800 transition-all duration-300 ${
        isCooking ? 'border-orange-400 ring-1 ring-orange-400/30' : 'border-gray-200'
    }`}>
      
      {/* Header */}
      <div className={`px-5 py-4 border-b rounded-t-xl flex justify-between items-start ${
          isCooking ? 'bg-orange-50 dark:bg-orange-900/10' : 'bg-gray-50 dark:bg-white/5'
      }`}>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    #{order.id.slice(-4).toUpperCase()}
                </h3>
                <span className="text-xs font-mono text-gray-500 bg-white dark:bg-black/20 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                    {getTimeElapsed(order.createdAt)}
                </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
        </div>
        
        <div className="text-right">
             <Badge color={order.ordertype === 'DELIVERY' ? 'info' : 'success'} size="sm">
                {order.ordertype}
             </Badge>
        </div>
      </div>

      {/* Order Items List - Scrollable if too long */}
      <div className="flex-1 p-5 overflow-y-auto min-h-[200px] max-h-[350px]">
        <ul className="space-y-4">
            {order.orderItems.map((item) => (
                <li key={item.id} className="pb-3 border-b border-dashed border-gray-100 last:border-0 dark:border-gray-800">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <span className="flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-gray-800 rounded-md dark:bg-gray-700 shrink-0">
                                {item.quantity}
                            </span>
                            <div>
                                <p className="font-medium text-gray-800 text-sm dark:text-gray-200 leading-tight">
                                    {item.menuItem.name}
                                </p>
                                {/* Options / Modifiers */}
                                {item.options.length > 0 && (
                                    <div className="mt-1 space-y-0.5">
                                        {item.options.map(opt => (
                                            <p key={opt.id} className="text-xs text-gray-500 dark:text-gray-400 pl-1 border-l-2 border-gray-200 dark:border-gray-700">
                                                {opt.variantOption.name}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
        
        {/* Customer Note (Optional) */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-900/30 dark:text-yellow-200">
            <span className="font-bold">Note:</span> Customer requested extra napkins.
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] rounded-b-xl">
        {order.status === "PENDING" || order.status === "CONFIRMED" ? (
             <button 
                onClick={() => onUpdateStatus(order.id, "PREPARING")}
                className="w-full py-3 text-sm font-bold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600 active:bg-orange-700 shadow-theme-xs flex items-center justify-center gap-2"
             >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/><path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Start Cooking
             </button>
        ) : (
            <button 
                onClick={() => onUpdateStatus(order.id, "READY")}
                className="w-full py-3 text-sm font-bold text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 active:bg-green-700 shadow-theme-xs flex items-center justify-center gap-2"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Mark as Ready
            </button>
        )}
      </div>
    </div>
  );
}