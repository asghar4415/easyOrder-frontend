  "use client"

  import React from "react"
  import { ShoppingCart, Trash2, Plus, Minus, Bike, Package } from "lucide-react"

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
    const [deliveryMethod, setDeliveryMethod] = React.useState<"delivery" | "collection">("delivery")

    return (
    <div className="flex flex-col h-full overflow-y-auto bg-card p-6">

        <div className="mb-6 flex flex-col gap-3">
          <h2 className="text-xl font-bold mb-4 text1">Basket</h2>

          {/* Delivery Method Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setDeliveryMethod("delivery")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 !rounded-full border-2 transition-all ${
                deliveryMethod === "delivery"
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-muted text-muted-foreground hover:border-accent/50"
              }`}
            >
              <Bike size={18} color="#DC5F00" />
              <div className="text-left text-sm">
                <p className="font-semibold">Delivery</p>
                <p className="text-xs opacity-75">Open 16:30</p>
              </div>
            </button>

            <button
              onClick={() => setDeliveryMethod("collection")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 !rounded-full border-2 transition-all ${
                deliveryMethod === "collection"
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-muted text-muted-foreground hover:border-accent/50"
              }`}
            >
              <Package size={18} color="#DC5F00" />
              <div className="text-left text-sm">
                <p className="font-semibold">Collection</p>
                <p className="text-xs opacity-75">Open 16:00</p>
              </div>
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-accent mb-3 opacity-60" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Fill your basket</h3>
            <p className="text-sm text-muted-foreground">Your basket is empty</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-4 mb-6">

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
