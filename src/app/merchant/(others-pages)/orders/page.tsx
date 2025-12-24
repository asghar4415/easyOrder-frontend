"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";
import { X, Bell, Check, Ban, Eye, CreditCard, Banknote } from "lucide-react"; // Added Icons

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrderFilter from "@/components/orders/OrderFilter";
import OrderTable from "@/components/orders/OrderTable";
import Pagination from "@/components/tables/Pagination"; 
import OrderDetailsModal from "@/components/orders/OrderDetails";
import Spinner from "@/components/ui/spinner"; 
import { Order, OrderStatus } from "@/types/order";
import { useRestaurant } from "@/context/RestaurantContext"; 

// --- UPDATED NOTIFICATION CARD ---
const NewOrderAlert = ({ 
    order, 
    onClose, 
    onView, 
    onAccept, 
    onReject 
}: { 
    order: Order; 
    onClose: () => void; 
    onView: () => void; 
    onAccept: (id: string) => void; 
    onReject: (id: string) => void; 
}) => {
  const isManualActionRequired = order.status === "PENDING";

  return (
    <div className={`fixed top-20 right-4 z-[9999] w-96 bg-white dark:bg-gray-800 border-l-4 ${isManualActionRequired ? 'border-yellow-500' : 'border-green-500'} shadow-2xl rounded-r-lg p-5 animate-in slide-in-from-right duration-500`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`${isManualActionRequired ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'} p-2 rounded-full animate-pulse`}>
            <Bell size={20} />
          </div>
          <div>
            <h4 className="font-bold text-base text-gray-800 dark:text-white">
                {isManualActionRequired ? "New Order Request" : "New Order Arrived"}
            </h4>
            <span className="text-xs text-gray-500 font-mono">#{order.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Order Info (Payment & Type) */}
      <div className="flex gap-2 mb-3">
         <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${order.paymenttype === 'CASH' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
            {order.paymenttype === 'CASH' ? <Banknote size={12}/> : <CreditCard size={12}/>}
            {order.paymenttype}
         </span>
         <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {order.ordertype}
         </span>
         <span className="ml-auto font-bold text-[#DC5F00]">€{Number(order.totalAmount).toFixed(2)}</span>
      </div>
      
      {/* Items Summary (Limit to 2 lines) */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md mb-4 text-sm text-gray-700 dark:text-gray-300 border dark:border-gray-700">
         {order.orderItems.slice(0, 2).map((item, idx) => (
             <div key={idx} className="flex justify-between">
                 <span className="font-medium">{item.quantity}x {item.menuItem?.name}</span>
             </div>
         ))}
         {order.orderItems.length > 2 && (
             <div className="text-xs text-gray-500 mt-1 italic">
                 + {order.orderItems.length - 2} more items...
             </div>
         )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex flex-col gap-2">
          
          {/* Always show View Details */}
          <button 
              onClick={onView}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#DC5F00] dark:text-gray-400 transition-colors"
          >
              <Eye size={14} /> View Full Details
          </button>

          {isManualActionRequired ? (
              <div className="flex gap-2 mt-1">
                  <button 
                      onClick={() => onReject(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                      <Ban size={16} /> Reject
                  </button>
                  <button 
                      onClick={() => onAccept(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 font-medium py-2 px-4 rounded-lg transition-colors shadow-sm text-sm"
                  >
                      <Check size={16} /> Accept
                  </button>
              </div>
          ) : (
             <div className="text-center text-xs text-green-600 bg-green-50 py-1 rounded">
                Order Automatically Accepted
             </div>
          )}
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const { restaurant, loading: restaurantLoading } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const socketRef = useRef<Socket | null>(null);
  const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  // 1. Fetch Orders API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurant?.id) return;

      setIsLoading(true);
      try {
        const token = Cookies.get("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!token) return;

        const response = await axios.get(`${apiUrl}/orders/getall-orders/${restaurant.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(response.data) ? response.data : [];
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!restaurantLoading && restaurant) {
      fetchOrders();
    }
  }, [restaurant, restaurantLoading]);

  // 2. Handle Status Update
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
        const token = Cookies.get("token");
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/update-order/${orderId}`, 
            { status }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status } : o));
        
        // Close notification
        if (newOrderNotification?.id === orderId) {
            setNewOrderNotification(null);
        }

    } catch (error) {
        console.error("Failed to update status", error);
        alert("Failed to update order status.");
    }
  };

  // 3. WebSocket Connection
  useEffect(() => {
    if (!restaurant?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL_WS;

    socketRef.current = io(socketUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true
    });

    socketRef.current.on("connect", () => {
        socketRef.current?.emit("joinRestaurant", restaurant.id);
    });

    socketRef.current.on("newOrder", (newOrder: Order) => {
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(e => console.log("Audio error:", e));
      } catch (e) { console.error(e); }

      setOrders((prev) => {
          if (prev.find(o => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev]; 
      });

      setCurrentPage(1);
      setFilter("ALL");
      setNewOrderNotification(newOrder);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [restaurant]);

  // 4. Data Filtering
  const filteredOrders = orders.filter(
    (order) => filter === "ALL" || order.status === filter
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const counts = orders.reduce((acc, order) => {
    acc["ALL"] = (acc["ALL"] || 0) + 1;
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (restaurantLoading || (isLoading && orders.length === 0)) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!restaurant) {
    return <div className="p-6 text-center text-gray-500">Restaurant profile not found.</div>;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Orders" />

      {newOrderNotification && (
        <NewOrderAlert 
          order={newOrderNotification}  
          onClose={() => setNewOrderNotification(null)}
          onView={() => { handleViewOrder(newOrderNotification); }}
          onAccept={(id) => handleUpdateStatus(id, "CONFIRMED")}
          onReject={(id) => handleUpdateStatus(id, "CANCELLED")}
        />
      )}
      
      <div className="space-y-6">
        <OrderFilter 
            currentFilter={filter} 
            onFilterChange={(f) => { setFilter(f); setCurrentPage(1); }} 
            counts={counts}
        />

        {filteredOrders.length > 0 ? (
            <OrderTable orders={currentOrders} onViewOrder={handleViewOrder} />
        ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl dark:bg-white/5 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">No orders found for this status.</p>
            </div>
        )}

        {totalPages > 1 && (
            <div className="flex justify-end mt-4">
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        )}
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}