"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Clock, CheckCircle, XCircle } from "lucide-react";

interface OrderStatusData {
  id: string;
  status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  ordertype: string;
  restaurantId: string;
}

export default function OrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch order status
  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
      
      // Handle response structure
      const data = response.data.data || response.data;
      setOrder(data);

      // Check if status has changed to an "Accepted" state
      if (["CONFIRMED", "PREPARING", "READY", "COMPLETED"].includes(data.status)) {
        return true; // Signal to stop polling
      }
      return false; // Keep polling
    } catch (error) {
      console.error("Error fetching order:", error);
      return false; // Keep polling even on error (retry)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    let isRedirecting = false;

    // 1. Initial Fetch
    fetchOrderStatus();

    // 2. Set up Polling (Every 4 seconds)
    const intervalId = setInterval(async () => {
      if (isRedirecting) return;

      const isAccepted = await fetchOrderStatus();
      
      if (isAccepted) {
        clearInterval(intervalId);
        isRedirecting = true;
        // Small delay for user to see the green checkmark before moving
        setTimeout(() => {
            router.push(`/order-success/${orderId}`);
        }, 1500); 
      }
    }, 4000); 

    // Cleanup
    return () => clearInterval(intervalId);
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1a17] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#DC5F00]" size={40} />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#1c1a17] text-[#EEEEEE] flex flex-col items-center justify-center p-4">
      <div className="bg-[#2b2a28] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/5 relative overflow-hidden">
        
        {/* Visual Status Indicator */}
        <div className="mb-8 flex justify-center">
          {order.status === "PENDING" && (
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="w-10 h-10 text-yellow-500" />
              </div>
              {/* Spinner Ring */}
              <div className="absolute top-0 left-0 w-24 h-24 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
          )}

          {order.status === "CANCELLED" && (
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center animate-in zoom-in">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          )}

          {/* Success State (Briefly shown before redirect) */}
          {["CONFIRMED", "PREPARING", "READY", "COMPLETED"].includes(order.status) && (
             <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center animate-in zoom-in">
               <CheckCircle className="w-10 h-10 text-green-500" />
             </div>
          )}
        </div>

        {/* Text Content */}
        {order.status === "PENDING" ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-2">Waiting for Restaurant</h2>
            <p className="text-zinc-400 mb-6">
              We have sent your order to the kitchen. Please wait while they confirm it.
            </p>
            <div className="inline-block bg-[#1c1a17] px-4 py-2 rounded-full border border-white/10 text-sm text-zinc-300">
              Order #{order.id.slice(-6).toUpperCase()}
            </div>
          </>
        ) : order.status === "CANCELLED" ? (
          <>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Order Declined</h2>
            <p className="text-zinc-400 mb-6">
              Unfortunately, the restaurant could not accept your order at this time.
            </p>
            <button 
              onClick={() => router.push("/")}
              className="bg-[#DC5F00] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              Return Home
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-green-500 mb-2">Order Accepted!</h2>
            <p className="text-zinc-400">Redirecting to receipt...</p>
          </>
        )}

      </div>
    </div>
  );
}