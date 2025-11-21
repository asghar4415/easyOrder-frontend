"use client"

import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useState } from "react"

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

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-accent text-accent-foreground rounded-full p-4 shadow-lg flex items-center gap-2 font-bold text-sm animate-pulse hover:animate-none hover:scale-110 transition-transform"
      >
        <ShoppingCart size={20} />
        <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">{itemCount}</span>
        <span className="hidden sm:inline">${total}</span>
      </button>

      {/* Modal Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Your Basket</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-accent font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border rounded-lg bg-muted">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-input transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-input transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-accent text-2xl">${total}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-accent text-accent-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
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
