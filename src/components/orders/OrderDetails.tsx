import React from "react";
import { Order } from "@/types/order";
import Badge from "@/components/ui/badge/Badge";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl dark:bg-gray-900 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center dark:border-gray-800 bg-gray-50 dark:bg-white/5">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Order #{order.id.slice(-6).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto">
          {/* Customer Info */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</h4>
              <p className="font-medium text-gray-800 dark:text-white">{order.user?.name || "Guest User"}</p>
              <p className="text-sm text-gray-500">{order.user?.email}</p>
              <p className="text-sm text-gray-500">{order.user?.phone || "No phone"}</p>
            </div>
            <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Order Info</h4>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Type:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">{order.ordertype}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Payment:</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">{order.paymenttype}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`text-sm font-bold ${
                    order.status === 'PENDING' ? 'text-yellow-500' : 
                    order.status === 'COMPLETED' ? 'text-green-500' : 'text-orange-500'
                    
                }`}>
                    {order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Items</h4>
          <div className="border rounded-lg border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-center">Qty</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 dark:text-white">{item.menuItem.name}</p>
                      {item.options?.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {item.options.map((opt) => (
                            <p key={opt.id} className="text-xs text-gray-500">
                              + {opt.variantOption.name} (+${opt.variantOption.price})
                            </p>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                        x{item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/5 flex justify-between items-center">
            <span className="text-gray-500">Total Items: {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
            <div className="text-right">
                <span className="text-sm text-gray-500 mr-3">Total Amount:</span>
                <span className="text-2xl font-bold text-orange-600">${order.totalAmount.toFixed(2)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}