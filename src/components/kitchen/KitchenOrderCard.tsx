import React from "react";
import { Order, OrderStatus } from "@/types/order";
import OrderTimer from "@/components/orders/OrderTimer"; // Import the timer

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  deliveryTime: number; // <--- ADD THIS PROP
}

export default function KitchenOrderCard({ order, onUpdateStatus, deliveryTime }: KitchenOrderCardProps) {
  
  // Format items string for display
  const itemsSummary = order.orderItems.length; 

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg text-gray-800 dark:text-gray-200">
              #{order.id.slice(-6).toUpperCase()}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
              order.ordertype === 'DELIVERY' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
            }`}>
              {order.ordertype}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* --- TIMER DISPLAY --- */}
        <OrderTimer createdAt={order.createdAt} durationMinutes={deliveryTime} />
      </div>

      {/* --- BODY (Items) --- */}
      <div className="p-4 flex-1 space-y-3">
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="flex gap-3 text-sm">
            <div className="font-bold text-gray-700 dark:text-gray-300 w-6">
              {item.quantity}x
            </div>
            <div className="flex-1">
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {item.menuItem?.name || "Unknown Item"}
              </p>
              {/* Render Options/Variations if they exist */}
              {item.options && item.options.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.options.map(opt => opt.variantOption?.name).join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
        {order.notes && (
           <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200 italic">
             Note: {order.notes}
           </div>
        )}
      </div>

      {/* --- FOOTER (Actions) --- */}
      <div className="p-4 border-t dark:border-gray-700 mt-auto bg-gray-50 dark:bg-gray-900/50">
        {order.status === "CONFIRMED" && (
          <button
            onClick={() => onUpdateStatus(order.id, "PREPARING")}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Start Preparing
          </button>
        )}
        {order.status === "PREPARING" && (
          <button
            onClick={() => onUpdateStatus(order.id, "READY")}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Mark Ready
          </button>
        )}
      </div>
    </div>
  );
}