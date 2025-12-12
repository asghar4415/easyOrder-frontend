"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OrderFilter from "@/components/orders/OrderFilter";
import OrderTable from "@/components/orders/OrderTable";
import Pagination from "@/components/tables/Pagination"; 
import OrderDetailsModal from "@/components/orders/OrderDetails";
import { Order, OrderStatus } from "@/types/order";
import { useRestaurant } from "@/context/RestaurantContext"; // Import Context
import Spinner from "@/components/ui/spinner"; // Assuming you have this
import {io, Socket} from "socket.io-client";
import {X, Bell, Check, Ban} from "lucide-react";

const NewOrderAlert = ({ order, onClose, onView, onAccept, onReject }: { order: Order; onClose: () => void; onView: () => void; onAccept: (id: string) => void; onReject: (id: string) => void }) => {

  const isManualActionRequired = order.status === "PENDING";
 return (
    <div className={`fixed top-20 right-4 z-[100] w-96 bg-white dark:bg-gray-800 border-l-4 ${isManualActionRequired ? 'border-yellow-500' : 'border-green-500'} shadow-2xl rounded-r-lg p-5 animate-in slide-in-from-right duration-500`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`${isManualActionRequired ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'} p-3 rounded-full animate-pulse`}>
            <Bell size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                {isManualActionRequired ? "New Order Request" : "New Order Arrived"}
            </h4>
            <p className="text-sm text-gray-500 font-mono">#{order.id.slice(-6).toUpperCase()}</p>
             {!isManualActionRequired && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Auto-Accepted</span>}
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="flex justify-between items-center text-sm mb-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Type: {order.ordertype}</span>
              <span className="font-bold text-[#DC5F00] text-lg">€{Number(order.totalAmount).toFixed(2)}</span>
          </div>

          {/* DYNAMIC BUTTONS */}
          {isManualActionRequired ? (
              <div className="flex gap-2">
                  <button 
                      onClick={() => onReject(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 font-medium py-2 px-4 rounded transition-colors"
                  >
                      <Ban size={16} /> Reject
                  </button>
                  <button 
                      onClick={() => onAccept(order.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 font-medium py-2 px-4 rounded transition-colors shadow-md"
                  >
                      <Check size={16} /> Accept
                  </button>
              </div>
          ) : (
              <button 
                  onClick={onView}
                  className="w-full bg-[#DC5F00] hover:bg-[#b04c00] text-white font-medium py-2 px-4 rounded transition-colors shadow-md"
              >
                  View Details
              </button>
          )}
      </div>
    </div>
  );
};

export default function OrdersPage() {
  // Context & State
  const { restaurant, loading: restaurantLoading } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const socketRef = React.useRef<Socket | null>(null);
  const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);
  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  // 1. Fetch Orders API
  useEffect(() => {
    const fetchOrders = async () => {
      // Wait for restaurant context to be ready
      if (!restaurant?.id) return;

      setIsLoading(true);
      try {
        const token = Cookies.get("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${apiUrl}/orders/getall-orders/${restaurant.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("Fetched orders:", response.data);

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

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
        const token = Cookies.get("token");
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/orders/update-order/${orderId}`, 
            { status }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state immediately
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status } : o));
        
        // Close notification if it matches the processed order
        if (newOrderNotification?.id === orderId) {
            setNewOrderNotification(null);
        }

    } catch (error) {
        console.error("Failed to update status", error);
        alert("Failed to update order status.");
    }
  };


  useEffect(() => {
    if (!restaurant?.id) return;


    // Initialize Socket
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL_WS, {
        transports: ['websocket', 'polling'], // Try websocket first
        withCredentials: true
    });

    // --- DEBUG LISTENERS ---
    socketRef.current.on("connect", () => {
        socketRef.current?.emit("joinRestaurant", restaurant.id);
    });

    socketRef.current.on("connect_error", (err) => {
        console.error("❌ Socket Connection Error:", err.message);
    });

    socketRef.current.on("disconnect", () => {
    });
    // -----------------------

    // Listen for New Orders
    socketRef.current.on("newOrder", (newOrder: Order) => {

      try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(e => console.log("Audio error (interaction needed first):", e));

      } catch (e) {
        console.error("Audio playback error:", e);
      }
      setOrders((prev) => {
          if (prev.find(o => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev]; // Prepend to top
      });

      setCurrentPage(1); // Reset to first page on new order
      setFilter("ALL");
      setNewOrderNotification(newOrder);
    });

    return () => {
      socketRef.current?.disconnect();
    };

    
}, [restaurant]);

      

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
    return (
      <div className="p-6 text-center text-gray-500">
        Restaurant profile not found.
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Orders" />

     {newOrderNotification && (
        <NewOrderAlert 
          order={newOrderNotification}  
          onClose={() => setNewOrderNotification(null)}
          onView={() => { handleViewOrder(newOrderNotification); setNewOrderNotification(null); }}
          onAccept={(id) => handleUpdateStatus(id, "CONFIRMED")}
          onReject={(id) => handleUpdateStatus(id, "CANCELLED")}
        />
      )}
      
      <div className="space-y-6">
        {/* Filter Tabs */}
        <OrderFilter 
            currentFilter={filter} 
            onFilterChange={(f) => { setFilter(f); setCurrentPage(1); }} 
            counts={counts}
        />

        {/* Table */}
        {filteredOrders.length > 0 ? (
            <OrderTable orders={currentOrders} onViewOrder={handleViewOrder} />
        ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-xl dark:bg-white/5 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">No orders found for this status.</p>
            </div>
        )}

        {/* Pagination */}
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

      {/* Details Modal */}
      <OrderDetailsModal 
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}