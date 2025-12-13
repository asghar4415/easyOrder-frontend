"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import KitchenOrderCard from "@/components/kitchen/KitchenOrderCard";
import { Order, OrderStatus } from "@/types/order";
import { useRestaurant } from "@/context/RestaurantContext";
import Spinner from "@/components/ui/spinner"; 

export default function KitchenPage() {
  const { restaurant } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); 

  const deliveryTime = restaurant?.deliveryTime ?? 30; 

  const fetchOrders = useCallback(async (isBackground = false) => {
    if (!restaurant?.id) return;

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
      console.error("Error fetching kitchen orders:", error);
    } finally {
      setIsLoading(false);
      if (!isBackground) setIsInitialLoading(false);
    }
  }, [restaurant]);

  useEffect(() => {
    fetchOrders(false);
    // You can actually reduce this interval if you are using WebSockets elsewhere
    const interval = setInterval(() => { fetchOrders(true); }, 30000); 
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    if (isUpdating) return;
    
    // Optimistic Update
    const previousOrders = [...orders];
    setOrders((prev) => 
        prev.map((order) => order.id === orderId ? { ...order, status: newStatus } : order)
    );

    try {
      const token = Cookies.get("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.put(
        `${apiUrl}/orders/update-order/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // No need to fetchOrders() immediately if optimistic update worked, 
      // but safe to keep to ensure data consistency
      fetchOrders(true);   
    } catch (error) {
      console.error("Failed to update status:", error);
      setOrders(previousOrders); // Revert on error
      alert("Failed to update status.");
    } finally {
        setIsUpdating(false);
    }
  };

  const activeOrders = orders.filter(o => 
    o.status === "CONFIRMED" || o.status === "PREPARING" 
  );

  // --- SORTING LOGIC: OLDEST FIRST ---
  const sortedOrders = activeOrders.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  if (isInitialLoading) return <div className="flex h-[50vh] justify-center items-center"><Spinner /></div>;

  const preparingCount = orders.filter(o => o.status === 'PREPARING').length;
  const queueCount = orders.filter(o => o.status === 'CONFIRMED').length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Kitchen Display</h2>
            <p className="text-sm text-gray-500">
               Live feed • Target: <span className="font-bold text-orange-600">{deliveryTime} mins</span>
            </p>
        </div>
        
        <div className="flex gap-3">
             <div className="px-4 py-2 bg-orange-50 border border-orange-100 rounded-lg dark:bg-orange-900/10 dark:border-orange-800">
                <span className="block text-xl font-bold text-orange-600 dark:text-orange-400">{preparingCount}</span>
                <span className="text-xs text-orange-600/80 uppercase font-semibold">Preparing</span>
             </div>
             <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg dark:bg-white/5 dark:border-gray-800">
                <span className="block text-xl font-bold text-gray-800 dark:text-white">{queueCount}</span>
                <span className="text-xs text-gray-500 uppercase font-semibold">Queue</span>
             </div>
        </div>
      </div>

      {sortedOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {sortedOrders.map((order) => (
            <KitchenOrderCard 
                key={order.id} 
                order={order} 
                onUpdateStatus={handleStatusUpdate} 
                deliveryTime={deliveryTime}
            />
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border border-dashed border-gray-300 rounded-xl dark:bg-white/5 dark:border-gray-700">
             <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
             <p className="text-gray-500">No active orders in the kitchen.</p>
             <button onClick={() => fetchOrders()} className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium">Refresh now</button>
        </div>
      )}
    </div>
  );
}