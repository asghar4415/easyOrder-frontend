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

export default function OrdersPage() {
  // Context & State
  const { restaurant, loading: restaurantLoading } = useRestaurant();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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