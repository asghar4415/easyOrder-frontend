import { useState, useEffect, useMemo } from "react"

export interface CartItem {
  id: string; name: string; price: number; quantity: number; image?: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  // const serviceFee = 0.50
  const serviceFee = 0.00

  // 1. Load Cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart")
      if (saved) setCart(JSON.parse(saved))
    } catch (e) { console.error(e) }
    setIsLoaded(true)
  }, [])

  // 2. Save Cart (only after load)
  useEffect(() => {
    if (isLoaded) localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart, isLoaded])

  // 3. Calculated Totals (Derived State - No setters needed!)
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    // const tax = subtotal * 0.135
    // const total = subtotal + tax + serviceFee
    const tax = 0
    const total = subtotal + tax + serviceFee
    return { subtotal, tax, total, serviceFee }
  }, [cart])

  return { cart, setCart, totals, isLoaded }
}