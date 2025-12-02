"use client"

import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface FloatingCartButtonProps {
  itemCount: number
  total: string
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
}

function FloatingCartButton({ itemCount, total, items, onRemoveItem, onUpdateQuantity }: FloatingCartButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const goToCheckout = () => {
    const restaurantId = localStorage.getItem("restaurant_id")
    router.push(`/restaurant/${restaurantId}/checkout`)
  }
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#2b2a28]! text-accent-foreground !rounded-full p-3 shadow-lg flex items-center gap-2 font-bold text-sm animate-pulse hover:animate-none hover:scale-110 transition-transform"
      >
        <ShoppingCart size={20} color="#DC5F00" />
        <span className="bg-white/20 px-2 py-1  rounded-full text-xs font-bold z-10">{itemCount}</span>
        {/* <span className="hidden sm:inline">${total}</span> */}
      </button>

      {/* Modal Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Your Basket</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors dark-button-2">
                <X size={24} color="#DC5F00" />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex-1">
                    {(() => {
                      const match = item.name.match(/^(.*?)\s*\((.+)\)$/)
                      const baseName = match ? match[1] : item.name
                      const variantsText = match ? match[2] : null

                      return (
                        <>
                          <p className="font-medium text-foreground">
                            {baseName}
                          </p>

                          {variantsText && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {variantsText}
                            </p>
                          )}
                        </>
                      )
                    })()}

                    <p className="text-accent font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border bg-[#2b2a28] rounded-full px-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="px-2 py-1 bg-card rounded-l-full dark-button-2"
                      >
                        <Minus size={16} color="#DC5F00" />

                      </button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-input transition-colors  dark-button-2"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} color="#DC5F00" />

                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors  dark-button-2"
                    >
                      <Trash2 size={16} color="#DC5F00" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-accent text-2xl">${total}</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to checkout page
                  goToCheckout()
                }}
                className="w-full !bg-[#DC5F00] text-accent-foreground font-bold py-3 !rounded-full hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FloatingCartButton
