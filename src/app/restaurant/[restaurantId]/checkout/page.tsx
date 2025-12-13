"use client"

import type React from "react"
import axios from "axios"
import { useState, useEffect } from "react"
import { Edit2, Loader2 } from "lucide-react" 
import { useCart } from "@/hooks/useCart"
import { Modal, CheckoutSection, COLORS } from "@/components/checkout-ui"
import { useRouter } from "next/navigation"

type ModalType = "PERSONAL" | "METHOD" | "TIME" | "PAYMENT" | null

export default function CheckoutPage() {
  const { cart, totals, setCart } = useCart()
  const router = useRouter()
  
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [error, setError] = useState({ message: "" })
  const [success, setSuccess] = useState({ message: "" })

  const [orderingMethod, setOrderingMethod] = useState("Delivery")
  const [paymentMethod, setPaymentMethod] = useState("Pay online")
  
  const [notes] = useState("") 

  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    county: "",
    eircode: ""
  })

  useEffect(() => {
    const savedCustomerId = localStorage.getItem("customerId")
    if (savedCustomerId) {
      fetchCustomerData(savedCustomerId)
    }
  }, [])

  useEffect(() => {
    if (success.message) {
      const timer = setTimeout(() => {
        setSuccess({ message: "" })
      }, 3000) 
      return () => clearTimeout(timer) 
    }
  }, [success.message])

  const fetchCustomerData = async (id: string) => {
    setIsLoadingUser(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/get-customer-info/${id}`)
      const user = response.data.user
      
      if (user) {
        const address = user.addresses?.[0] || {}
        const nameParts = user.name ? user.name.split(" ") : ["", ""]
        const firstName = nameParts[0] || ""
        const lastName = nameParts.slice(1).join(" ") || ""

        setCustomerInfo({
          firstName,
          lastName,
          email: user.email || "",
          phone: user.phone || "",
          line1: address.line1 || "",
          line2: address.line2 || "",
          city: address.city || "",
          county: address.county || "",
          eircode: address.eircode || ""
        })
      }
    } catch (err) {
      console.error("Failed to fetch saved customer", err)
      localStorage.removeItem("customerId")
    } finally {
      setIsLoadingUser(false)
    }
  }

    const handleSaveCustomerInfo = async () => {
    setError({ message: "" })
    setSuccess({ message: "" })

    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.line1 || !customerInfo.city || !customerInfo.county) {
      setError({ message: "Please fill in all required fields marked with *" })
      return
    }

    setIsSaving(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/save-customer-info`, 
        customerInfo
      )
      if (response.data) {
        setSuccess({ message: "Your information saved successfully!" })
        localStorage.setItem("customerId", response.data.user.id)
        closeModal()
      }
    } catch (err: any) {
      console.error("Error saving info", err)
      const backendMessage = err.response?.data?.error || err.message || "Failed to save customer information."
      setError({ message: backendMessage })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePlaceOrder = async () => {
    setError({ message: "" })

    const customerId = localStorage.getItem("customerId")
    
    if (!customerId) {
      setError({ message: "Please save your Customer Details before placing the order." })
      setActiveModal("PERSONAL") 
      return
    }

    if (cart.length === 0) {
      setError({ message: "Your cart is empty." })
      return
    }

    setIsPlacingOrder(true)

    try {

      const backendOrderType = orderingMethod === "Delivery" ? "DELIVERY" : "COLLECTION"
      
      let backendPaymentType = "CASH"
      if (paymentMethod === "Pay online" || paymentMethod === "Card") {
        backendPaymentType = "CARD"
      }

      const restaurantId = cart[0]?.restaurantId || "YOUR_RESTAURANT_ID_HERE" 

      const payload = {
        restaurantId: restaurantId,
        items: cart.map(item => {
           let rawMenuItemId = (item as any).menuItemId;
          let rawOptionIds = (item as any).selectedOptionIds || [];


         if (!rawMenuItemId && item.id.includes("-")) {
                const parts = item.id.split("-");
                rawMenuItemId = parts[0]; 
                
                if (rawOptionIds.length === 0) {
                    rawOptionIds = parts.slice(1);
                }
            } else if (!rawMenuItemId) {
                rawMenuItemId = item.id;
            }

          return {
            menuItemId: rawMenuItemId,
            quantity: item.quantity,
            optionIds: rawOptionIds
          }
        }),
        notes: notes,
        deliveryAddress: `${customerInfo.line1}, ${customerInfo.city}, ${customerInfo.county}`, 
        currency: "eur",
        ordertype: backendOrderType,
        paymenttype: backendPaymentType
      }
// console.log("Order Payload:", payload);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/create-order/${customerId}`, 
        payload
      )

      const orderData = response.data;
if (orderData.paymentUrl) {
        window.location.href = response.data.paymentUrl;
}
        else {
           setCart([]);
if (typeof window !== "undefined") localStorage.removeItem("cart");
      setSuccess({ message: "Order placed successfully!" });
         setTimeout(() => {
             router.push(`/order-success/${orderData.id}`);
          }, 2000);
    }

    } catch (err: any) {
      console.error("Error placing order", err)
      const backendMessage = err.response?.data?.error || err.message || "Failed to place order."
      setError({ message: backendMessage })
    } finally {
      setIsPlacingOrder(false)
    }
  } 

  // Helper to close modal
  const closeModal = () => {
    setActiveModal(null)
    setError({ message: "" })
  }

  return (
    <div className="bg-[#1c1a17] min-h-screen text-foreground px-4 md:px-12 py-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className={`text-3xl md:text-4xl font-bold text-[${COLORS.primary}]`}>Checkout</h1>
        <p className={`text-medium text-[${COLORS.text}] mt-2`}>
          Review your order and provide the necessary details to complete your purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Checkout Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#2b2a28] rounded-lg shadow-sm p-5">

            {/* 1. Contact Section */}
            <CheckoutSection 
              title="CUSTOMER DETAILS" 
              onEdit={() => setActiveModal("PERSONAL")}
              icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>}
            >
              {isLoadingUser ? (
                 <div className="animate-pulse space-y-2">
                   <div className="h-4 bg-white/10 rounded w-1/3"></div>
                   <div className="h-4 bg-white/10 rounded w-1/2"></div>
                 </div>
              ) : customerInfo.firstName && customerInfo.line1 ? (
                <div className="space-y-2 text-sm text-[#EEEEEE]">
                  <p><strong className="text-zinc-400">Name:</strong> {customerInfo.firstName} {customerInfo.lastName}</p>
                  <p><strong className="text-zinc-400">Email:</strong> {customerInfo.email}</p>
                  <p><strong className="text-zinc-400">Phone:</strong> {customerInfo.phone}</p>
                  <div className="border-t border-white/10 my-2 pt-2">
                    <p><strong className="text-zinc-400">Address:</strong></p>
                    <p>{customerInfo.line1}</p>
                    {customerInfo.line2 && <p>{customerInfo.line2}</p>}
                    <p>{customerInfo.city}, {customerInfo.county}</p>
                    <p>{customerInfo.eircode}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveModal("PERSONAL")}
                  className="w-full px-4 py-2 border border-dashed border-zinc-600 !bg-[#2b2a28] rounded-lg text-[#EEEEEE] hover:border-[#DC5F00] hover:text-[#DC5F00] transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} color="#DC5F00" /> Add Details
                </button>
              )}
            </CheckoutSection>

            {/* 2. Ordering Method Section */}
            <CheckoutSection 
              title="ORDERING METHOD" 
              onEdit={() => setActiveModal("METHOD")}
              icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 6h-2c0-2.76-2.24-5-5-5s-5 2.24-5 5H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-2c1.66 0 3 1.34 3 3h-6c0-1.66 1.34-3 3-3z" /></svg>}
            >
              <p className="text-sm text-[#EEEEEE]">{orderingMethod}</p>
            </CheckoutSection>

            {/* 3. Payment Section */}
            <CheckoutSection 
              title="PAYMENT METHOD" 
              onEdit={() => setActiveModal("PAYMENT")}
              icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8H4V6h16m0 10H4c-1.11 0-1.99.9-1.99 2L2 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-1 3v2h-6v-2h6z" /></svg>}
            >
              <p className="text-sm text-[#EEEEEE]">{paymentMethod}</p>
            </CheckoutSection>
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="md:col-span-1">
          {/* We pass the handlePlaceOrder function and loading state to the summary component */}
          <OrderSummary 
            cart={cart} 
            totals={totals} 
            onPlaceOrder={handlePlaceOrder} 
            isProcessing={isPlacingOrder} 
          />
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {activeModal === "PERSONAL" && (
        <Modal onClose={closeModal} title="Customer Details">
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              handleSaveCustomerInfo(); 
            }} 
            className="space-y-4 max-h-[90vh] overflow-y-auto pr-2 pl-2"
          >
            {error.message && (
              <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-sm">
                {error.message}
              </div>
            )}

            <h4 className="text-xs font-bold text-[#DC5F00] uppercase tracking-wider mb-2">Contact Info</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder="First Name *" 
                value={customerInfo.firstName} 
                onChange={(v: string) => setCustomerInfo({...customerInfo, firstName: v})} 
                required 
              />
              <Input 
                placeholder="Last Name *" 
                value={customerInfo.lastName} 
                onChange={(v: string) => setCustomerInfo({...customerInfo, lastName: v})} 
                required 
              />
            </div>
            
            <Input 
              placeholder="Email Address *" 
              type="email"
              value={customerInfo.email} 
              onChange={(v: string) => setCustomerInfo({...customerInfo, email: v})} 
              required 
            />
            
            <Input 
              placeholder="Phone Number" 
              type="tel"
              value={customerInfo.phone} 
              onChange={(v: string) => setCustomerInfo({...customerInfo, phone: v})} 
            />

            <div className="border-t border-white/10 my-2"></div>

            <h4 className="text-xs font-bold text-[#DC5F00] uppercase tracking-wider mb-2">Address</h4>
            
            <Input 
              placeholder="Address Line 1 *" 
              value={customerInfo.line1} 
              onChange={(v: string) => setCustomerInfo({...customerInfo, line1: v})} 
              required
            />
            
            <Input 
              placeholder="Address Line 2 (Optional)" 
              value={customerInfo.line2} 
              onChange={(v: string) => setCustomerInfo({...customerInfo, line2: v})} 
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Input 
                placeholder="City *" 
                value={customerInfo.city} 
                onChange={(v: string) => setCustomerInfo({...customerInfo, city: v})} 
                required
              />
              <Input 
                placeholder="County *" 
                value={customerInfo.county} 
                onChange={(v: string) => setCustomerInfo({...customerInfo, county: v})} 
                required
              />
            </div>
            
            <Input 
              placeholder="Eircode (Postcode)" 
              value={customerInfo.eircode} 
              onChange={(v: string) => setCustomerInfo({...customerInfo, eircode: v})} 
            />

            <PrimaryButton 
              type="submit" 
              disabled={isSaving} 
              className="mt-4 !bg-[#DC5F00]"
            >
              {isSaving ? "Saving..." : "Save Details"}
            </PrimaryButton>
          </form>
        </Modal>
      )}

      {activeModal === "METHOD" && (
        <Modal onClose={closeModal} title="Select Order Type">
          <form onSubmit={(e) => { e.preventDefault(); closeModal(); }} className="space-y-4">
            {["Delivery", "Collection"].map(m => (
              <RadioOption key={m} label={m} name="method" checked={orderingMethod === m} onChange={() => setOrderingMethod(m)} />
            ))}
            <PrimaryButton>Save</PrimaryButton>
          </form>
        </Modal>
      )}

      {activeModal === "PAYMENT" && (
        <Modal onClose={closeModal} title="Payment Method">
           <form onSubmit={(e) => { e.preventDefault(); closeModal(); }} className="space-y-4">
            {["Cash on delivery", "Pay online"].map(p => (
              <RadioOption key={p} label={p} name="payment" checked={paymentMethod === p} onChange={() => setPaymentMethod(p)} />
            ))}
            <PrimaryButton>Save</PrimaryButton>
          </form>
        </Modal>
      )}

      {/* Global Error Message (e.g. if Cart empty) */}
      {error.message && !activeModal && (
         <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-900/90 border border-red-500/50 rounded text-white text-sm px-6 py-3 shadow-lg z-50">
         {error.message}
       </div>
      )}

      {/* Global Success Message */}
      {success.message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-900/90 border border-green-500/50 rounded text-white text-sm px-6 py-3 shadow-lg z-50">
          {success.message}
        </div>
      )}
    </div>
  )
}

// --- Helper Components ---

interface OrderSummaryProps {
  cart: any[]
  totals: any
  onPlaceOrder: () => void
  isProcessing: boolean
}

function OrderSummary({ cart, totals, onPlaceOrder, isProcessing }: OrderSummaryProps) {
  return (
    <div className={`bg-[${COLORS.bgCard}] rounded-lg p-6 shadow-sm sticky top-8`}>
      <h2 className="text-lg font-bold mb-4" style={{ color: COLORS.text }}>Order Summary</h2>
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {cart.length === 0 ? <p className="text-zinc-500 text-center py-6">Empty cart.</p> : cart.map((item) => (
          <div key={item.id} className="flex justify-between items-start gap-2 text-sm pb-3 border-b border-white/10">
            <div className="flex-1 text-[#EEEEEE]">
              <p className="font-medium">{item.quantity}x</p>
              <p>{item.name}</p>
            </div>
            <p className="font-semibold text-[#EEEEEE]">€{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 py-4 border-t border-white/10">
        <Row label="Sub-Total" value={totals.subtotal} />
        <Row label="Service fee" value={totals.serviceFee} />
        <Row label="Sales Tax (13.5%)" value={totals.tax} />
      </div>
      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
        <span className="font-bold text-[#EEEEEE]">Total</span>
        <span className="text-2xl font-bold text-[#EEEEEE]">€{totals.total.toFixed(2)}</span>
      </div>
      
      {/* Updated Button to use Logic */}
      <PrimaryButton 
        className="mt-6 !bg-[#DC5F00] flex items-center justify-center gap-2" 
        onClick={onPlaceOrder}
        disabled={isProcessing || cart.length === 0}
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" /> Processing...
          </>
        ) : "Place Order"}
      </PrimaryButton>
    </div>
  )
}

const Row = ({ label, value }: { label: string, value: number }) => (
  <div className="flex justify-between text-sm">
    <span className="text-zinc-400">{label}</span>
    <span className="text-[#EEEEEE] font-medium">€{value.toFixed(2)}</span>
  </div>
)

const Input = ({ onChange, ...props }: any) => (
  <input {...props} 
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-3 rounded-lg border border-white/10 !bg-transparent text-[#EEEEEE] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#DC5F00]" 
  />
)

const RadioOption = ({ label, name, checked, onChange }: any) => (
  <label className="flex items-center gap-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
    <input type="radio" name={name} checked={checked} onChange={onChange} className="w-4 h-4 accent-[#DC5F00]" />
    <span className="text-[#EEEEEE] font-medium">{label}</span>
  </label>
)

const PrimaryButton = ({ children, className = "", disabled, ...props }: any) => (
  <button 
    disabled={disabled}
    className={`w-full px-5 py-3 !bg-[#DC5F00] text-white font-bold rounded-lg transition 
    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"} ${className}`}
    {...props}
  >
    {children}
  </button>
)