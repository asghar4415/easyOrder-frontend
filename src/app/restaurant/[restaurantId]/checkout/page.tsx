"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Edit2 } from "lucide-react"

// --- Interfaces ---
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export default function CheckoutPage() {
  const [total, setTotal] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [serviceFee] = useState(0.5)
  const [salesTax, setSalesTax] = useState(0)

  // Modals
  const [showPersonalModal, setShowPersonalModal] = useState(false)
  const [showOrderingMethodModal, setShowOrderingMethodModal] = useState(false)
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)

  // Personal & Address info
  const [personalDetails, setPersonalDetails] = useState({ firstName: "", lastName: "", email: "", phone: "" })
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", postcode: "" })
  const [orderingMethod, setOrderingMethod] = useState("Delivery")
  const [timeChoice, setTimeChoice] = useState("As soon as possible")
  const [paymentMethod, setPaymentMethod] = useState("Pay online")
  const [comments, setComments] = useState("")

const [cart, setCart] = useState<CartItem[]>(() => {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  } catch {
    localStorage.removeItem("cart")
    return []
  }
})

  // Persist cart & calculate totals
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(cart))
    const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setSubtotal(sub)
    const tax = sub * 0.135 
    setSalesTax(tax)
    setTotal(sub + serviceFee + tax)
  }, [cart, serviceFee])

const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id))
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id)
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
  }


  return (
    <div className="bg-[#1c1a17] min-h-screen text-foreground px-4 md:px-12 py-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-[#DC5F00]">Checkout</h1>
        <p className="text-medium text-[#EEEEEE] mt-2">
          Review your order and provide the necessary details to complete your purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT: Checkout Details */}
        <div className="md:col-span-2 space-y-6">
          {/* CONTACT Section */}
          <div className="bg-[#2c2a27] rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4 ">
              <h2 className="text-lg font-bold text-[#EEEEEE] flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                CONTACT
              </h2>
              <button
                onClick={() => setShowPersonalModal(true)}
                className="text-sm text-muted-foreground dark-button-2 hover:text-foreground transition flex items-center gap-1"
              >
                <Edit2 size={16} className="text-[#DC5F00]" />
                Edit
              </button>
            </div>

            {personalDetails.firstName ? (
              <div className="space-y-2 text-sm">
                <p>
                  <strong>
                    {personalDetails.firstName} {personalDetails.lastName}
                  </strong>
                </p>
                <p className="text-muted-foreground">{personalDetails.email}</p>
                <p className="text-muted-foreground">{personalDetails.phone}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-4">No contact details added</p>
                <button
                  onClick={() => setShowPersonalModal(true)}
                  className="w-full px-4 py-2 border border-dashed dark-button-2 border-border rounded-lg text-muted-foreground hover:border-[#DC5F00] hover:text-[#DC5F00] transition font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Add details
                </button>
              </div>
            )}
          </div>

          {/* ORDERING METHOD Section */}
          <div className="bg-[#2c2a27] rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#EEEEEE] flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6h-2c0-2.76-2.24-5-5-5s-5 2.24-5 5H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-2c1.66 0 3 1.34 3 3h-6c0-1.66 1.34-3 3-3z" />
                </svg>
                ORDERING METHOD
              </h2>
              <button
                onClick={() => setShowOrderingMethodModal(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1 dark-button-2"
              >
                <Edit2 size={16} className="text-[#DC5F00]" />
                Edit
              </button>
            </div>
            <p className="text-sm text-[#EEEEEE]">{orderingMethod}</p>
          </div>

          {/* AVAILABLE TIME CHOICE Section */}
          <div className="bg-[#2c2a27] rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#EEEEEE] flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-7 0c0 .83-.67 1.5-1.5 1.5S4 11.83 4 11c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5z" />
                </svg>
                AVAILABLE TIME CHOICE
              </h2>
              <button
                onClick={() => setShowTimeModal(true)}
                className="text-sm text-muted-foreground hover:text-foreground dark-button-2 transition flex items-center gap-1"
              >
                <Edit2 size={16} className="text-[#DC5F00]" />
                Edit
              </button>
            </div>
            <p className="text-sm text-[#EEEEEE]">{timeChoice}</p>
          </div>

          {/* PAYMENT METHOD Section */}
          <div className="bg-[#2c2a27] rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#EEEEEE] flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8H4V6h16m0 10H4c-1.11 0-1.99.9-1.99 2L2 20c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-1 3v2h-6v-2h6z" />
                </svg>
                PAYMENT METHOD
              </h2>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-sm text-muted-foreground dark-button-2 hover:text-foreground transition flex items-center gap-1"
              >
                <Edit2 size={16} className="text-[#DC5F00]" />
                Edit
              </button>
            </div>
            <p className="text-sm text-[#EEEEEE]">{paymentMethod}</p>
          </div>

          {/* COMMENTS Section */}
          {/* <button
            onClick={() => setShowCommentsModal(true)}
            className="text-sm text-muted-foreground hover:text-[#DC5F00] transition underline"
          >
            Comments (Optional)
          </button> */}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-[#2c2a27] rounded-lg border border-border p-6 shadow-sm sticky top-8">
            <h2 className="text-lg font-bold mb-4 text-[#EEEEEE]">Order Summary</h2>

            {/* Items List */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-2 text-sm pb-3 border-b border-border last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-[#EEEEEE]">{item.quantity}x</p>
                      <p className="text-[#EEEEEE] text-sm">{item.name}</p>
                    </div>
                    <p className="font-semibold text-[#EEEEEE]">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 py-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sub-Total</span>
                <span className="text-[#EEEEEE] font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-[#EEEEEE] font-medium">€{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sales Tax (13.50% included)</span>
                <span className="text-[#EEEEEE] font-medium">€{salesTax.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-border flex justify-between items-center">
              <span className="font-bold text-[#EEEEEE]">Total</span>
              <span className="text-2xl font-bold text-[#EEEEEE]">€{total.toFixed(2)}</span>
            </div>

            {/* Place Order Button */}
            <button className="w-full mt-6 bg-[#DC5F00]! text-white font-bold py-3 rounded-lg hover:opacity-90 transition">
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Personal Details Modal */}
      {showPersonalModal && (
        <Modal onClose={() => setShowPersonalModal(false)} title="Personal Details">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowPersonalModal(false)
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3 ">
              <input
                type="text"
                placeholder="First Name"
                value={personalDetails.firstName}
                onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                className="p-3 rounded-lg border border-border dark-button-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#DC5F00]"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={personalDetails.lastName}
                onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
                className="p-3 rounded-lg border border-border dark-button-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#DC5F00]"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={personalDetails.email}
              onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
              className="w-full p-3 rounded-lg border border-border dark-button-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#DC5F00]"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={personalDetails.phone}
              onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
              className="w-full p-3 rounded-lg border border-border dark-button-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#DC5F00]"
            />
            <button
              type="submit"
              className="w-full px-5 py-3 bg-[#DC5F00]! text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Ordering Method Modal */}
      {showOrderingMethodModal && (
        <Modal onClose={() => setShowOrderingMethodModal(false)} title="Select Order Type">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowOrderingMethodModal(false)
            }}
            className="space-y-4"
          >
            {["Delivery", "Collection", "Dine In"].map((method) => (
              <label
                key={method}
                className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition"
              >
                <input
                  type="radio"
                  name="method"
                  value={method}
                  checked={orderingMethod === method}
                  onChange={(e) => setOrderingMethod(e.target.value)}
                  className="w-4 h-4 accent-[#DC5F00]"
                />
                <span className="text-foreground font-medium">{method}</span>
              </label>
            ))}
            <button
              type="submit"
              className="w-full px-5 py-3 bg-[#DC5F00]! text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Time Choice Modal */}
      {showTimeModal && (
        <Modal onClose={() => setShowTimeModal(false)} title="Select Time">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowTimeModal(false)
            }}
            className="space-y-4"
          >
            {["As soon as possible", "Later today", "Tomorrow"].map((time) => (
              <label
                key={time}
                className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition"
              >
                <input
                  type="radio"
                  name="time"
                  value={time}
                  checked={timeChoice === time}
                  onChange={(e) => setTimeChoice(e.target.value)}
                  className="w-4 h-4 accent-[#DC5F00]"
                />
                <span className="text-foreground font-medium">{time}</span>
              </label>
            ))}
            <button
              type="submit"
              className="w-full px-5 py-3 bg-[#DC5F00]! text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <Modal onClose={() => setShowPaymentModal(false)} title="Payment Method">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowPaymentModal(false)
            }}
            className="space-y-4"
          >
            {["Pay online", "Cash on delivery", "Card"].map((method) => (
              <label
                key={method}
                className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-card/50 transition"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-[#DC5F00]"
                />
                <span className="text-foreground font-medium">{method}</span>
              </label>
            ))}
            <button
              type="submit"
              className="w-full px-5 py-3 bg-[#DC5F00]! text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Save
            </button>
          </form>
        </Modal>
      )}

      {/* Comments Modal */}
      {showCommentsModal && (
        <Modal onClose={() => setShowCommentsModal(false)} title="Add Comments">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowCommentsModal(false)
            }}
            className="space-y-4"
          >
            <textarea
              placeholder="Add any special requests or comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 rounded-lg border border-border dark-button-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#DC5F00] resize-none h-32"
            />
            <button
              type="submit"
              className="w-full px-5 py-3 bg-[#DC5F00] text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Save
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

// --- Modal Component ---
interface ModalProps {
  onClose: () => void
  title: string
  children: React.ReactNode
}

function Modal({ onClose, title, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-card rounded-lg w-full max-w-md p-6 relative shadow-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-background dark-button-2 rounded-full! transition">
            <X size={20} className="text-[#DC5F00]" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
