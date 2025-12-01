"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/useCart"

export default function OrderSuccessPage() {
  const { setCart } = useCart()
  const params = useParams()
  const orderId = params.id

  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 1. Clear the cart immediately when this page loads
  useEffect(() => {
    setCart([]) // Clear state
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart") // Clear storage
    }
  }, [setCart])

  // 2. Fetch Order Details to get Restaurant ID
  useEffect(() => {
    if (!orderId) return

    const fetchOrderDetails = async () => {
      try {
        // We fetch the order to know which restaurant to send them back to
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`)
        console.log("Order Details Response:", response.data)
        const orderData = response.data
        
        if (orderData && orderData.restaurantId) {
          setRestaurantId(orderData.restaurantId)
        }
      } catch (error) {
        console.error("Failed to fetch order details", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  // Logic to determine where the back button goes
  // If we found the ID, go to that menu. If not (error/loading), go to home/browsing.
  const backLink = restaurantId ? `/restaurant/${restaurantId}/menu` : "/"

  return (
    <div className="min-h-screen bg-[#1c1a17] text-[#EEEEEE] flex flex-col items-center justify-center p-4">
      <div className="bg-[#2b2a28] p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/5">
        
        {/* Success Icon */}
        <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-[#DC5F00] mb-2">Order Confirmed!</h1>
        <p className="text-zinc-400 mb-6">
          Thank you for your purchase. Your order has been received and is being prepared.
        </p>

        {/* Order ID Badge */}
        <div className="bg-[#1c1a17] py-3 px-4 rounded-lg mb-8 inline-block border border-dashed border-zinc-700">
          <span className="text-zinc-500 text-sm mr-2">Order ID:</span>
          <span className="font-mono font-medium text-[#EEEEEE]">{orderId}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {loading ? (
             <div className="w-full flex items-center justify-center gap-2 bg-[#DC5F00]/50 text-white/50 font-bold py-3 px-6 rounded-lg cursor-wait">
               <Loader2 className="animate-spin" size={20} /> Loading Menu...
             </div>
          ) : (
            <Link 
              href={backLink}
              className="w-full flex items-center justify-center gap-2 bg-[#DC5F00] hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              <ShoppingBag size={20} />
              {restaurantId ? "Back to Menu" : "Back to Home"}
            </Link>
          )}

          <Link 
            href={`/orders/${orderId}`} 
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-zinc-600 hover:border-white text-zinc-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-all"
          >
            Track Order
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  )
}