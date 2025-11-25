"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import RestaurantHeader from "@/components/restaurant-header"
import MenuItemCard from "@/components/menu-item-card"
import ShoppingBasket from "@/components/shopping-basket"
import CategoryNav from "@/components/category-nav"
import FloatingCartButton from "@/components/floating-cart-button"
import { Navbar } from "@/components/navbar"

// --- Interfaces ---
interface MenuOption {
  id: string
  name: string
  price: number
  isAvailable?: boolean
}

interface MenuVariant {
  id: string
  name: string
  type: string
  isRequired: boolean
  minOptions?: number
  maxOptions?: number
  options: MenuOption[]
}

interface MenuItem {
  id: string
  name: string
  description: string
  basePrice: number
  image: string
  categoryId: string
  variants: MenuVariant[]
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

// FIX: Added missing fields that Header uses
interface RestaurantData {
  id: string
  name: string
  logo: string
  banner: string // Added
  address: string // Added
  categories: Category[]
  rating?: number // Added
}

// Cart Item needs to store option details
interface CartItem {
  id: string
  name: string
  description: string // Added to match usage
  price: number
  quantity: number
  image?: string // Added
}

export default function RestaurantMenu() {
  const { restaurantId } = useParams()
  const router = useRouter()

  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Highlights")
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "collection">("delivery")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!restaurantId) return

    const fetchRestaurant = async () => {
      try {
        setLoading(true)
        // Ensure your backend route is correct here
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants/restaurant-data/${restaurantId}`
        )
        setRestaurant(res.data.data || res.data) // Handle response structure
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Restaurant not found")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [restaurantId])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // FIX: Safety check - if restaurant is null, return empty array
  // Mapped items to match the prop interface expected by MenuItemCard
  const allItems = restaurant?.categories?.flatMap((c) =>
    c.items.map((item) => ({
      ...item,
      price: item.basePrice, // Map basePrice to price
      category: c.name,
      // Map the first variant's options to a flat options array
      options: item.variants?.[0]?.options?.map((opt) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
      })) || [],
    }))
  ) || []

  const filteredItems =
    activeCategory === "All"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory)

  // FIX: Safety check for categories
  const categories = restaurant ? ["All", ...restaurant.categories.map((c) => c.name)] : []

  // FIX: Added type safety for params
  const addToCart = (item: any, selectedOption: MenuOption | undefined, qty = 1) => {
    const cartId = selectedOption
      ? `${item.id}-${selectedOption.id}`
      : item.id

    setCart((prev) => {
      const existing = prev.find((c) => c.id === cartId)
      if (existing) {
        return prev.map((c) =>
          c.id === cartId ? { ...c, quantity: c.quantity + qty } : c
        )
      }
      return [
        ...prev,
        {
          id: cartId,
          name: item.name + (selectedOption ? ` (${selectedOption.name})` : ""),
          description: item.description,
          price: item.price + (selectedOption?.price || 0),
          quantity: qty,
          image: item.image
        },
      ]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) {
        removeFromCart(id);
        return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    )
  }

  const total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2)

  if (loading) {
    return <div className="p-10 text-center text-white">Loading menu...</div>
  }
  
  if (error) {
    // You might want to show a UI instead of pushing immediately
    return <div className="p-10 text-center text-red-500">{error}</div>
  }

  if (!restaurant) {
    return <div className="p-10 text-center text-white">No restaurant data found.</div>
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <div className="md:overflow-y-auto pb-6">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 md:gap-0 md:min-h-[calc(100vh-80px)]">
            
            {/* Left Column */}
            <div className="md:overflow-y-auto">
              <RestaurantHeader
                deliveryMode={deliveryMode}
                setDeliveryMode={setDeliveryMode}
                restaurant={restaurant}
              />

              <div className="px-4 mb-6 sticky top-16 z-30 py-3 md:py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-3xl">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      size={20}
                      color="#DC5F00"
                    />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-2 py-2 border border-border text-foreground placeholder-muted-foreground focus:outline-none !bg-[#2b2a28] !rounded-full"
                    />
                  </div>
                </div>
              </div>

              <CategoryNav
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />

              <div className="md:px-4 md:px-0 space-y-4 pb-20">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Desktop Cart */}
            <div className="hidden md:flex flex-col fixed top-0 right-0 w-[380px] h-screen bg-[#1c1a17] shadow-xl z-40 border-l border-gray-800">
              <ShoppingBasket
                items={cart}
                total={total}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQty}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Cart */}
      {isMobile && cart.length > 0 && (
        <FloatingCartButton
          itemCount={cart.length}
          total={total} // FIX: Passed 'total' instead of undefined 'cartTotal'
          items={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQty}
        />
      )}
    </div>
  )
}