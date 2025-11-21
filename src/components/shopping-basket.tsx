"use client"

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import "@/app/restaurant/restaurant.css"


interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface ShoppingBasketProps {
  items: CartItem[]
  total: string
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
}

function ShoppingBasket({ items, total, onRemoveItem, onUpdateQuantity }: ShoppingBasketProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <ShoppingCart size={24} className="text-accent" />
        Your basket
      </h2>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
          <p className="text-muted-foreground font-medium">Fill your basket</p>
          <p className="text-sm text-muted-foreground">Add items to get started</p>
        </div>
      ) : (
        <>
          {/* Items List */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 pb-4 border-b border-border last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{item.name}</p>
                  <p className="text-accent font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-border rounded-lg bg-muted">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-input transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-input transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Checkout */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-accent text-2xl">${total}</span>
            </div>
            <button className="w-full bg-accent text-accent-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ShoppingBasket
