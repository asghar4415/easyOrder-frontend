"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Search } from "lucide-react"
import RestaurantHeader from "@/components/restaurant-header"
import MenuItemCard from "@/components/menu-item-card"
import ShoppingBasket from "@/components/shopping-basket"
import CategoryNav from "@/components/category-nav"
import FloatingCartButton from "@/components/floating-cart-button"
import { Navbar } from "@/components/navbar"
import Spinner  from "@/components/ui/spinner"

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
  price?: number // mapped
  image?: string
  categoryId: string
  variants?: MenuVariant[]
}

interface Category {
  id: string
  name: string
  items: MenuItem[]
}

interface RestaurantData {
  id: string
  name: string
  slug?: string
  logo?: string
  banner?: string
  address?: string
  categories: Category[]
  rating?: number
}

interface CartItem {
  restaurantId: string
  id: string
  menuItemId?: string
  selectedOptionIds?: string[]
  name: string
  description?: string
  price: number
  quantity: number
  image?: string
}

export default function RestaurantMenu() {
  const params = useParams()
  const restaurantSlug = params.restaurantId
  

  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "collection">("delivery")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!restaurantSlug) return

    const fetchRestaurant = async () => {
      try {
        setLoading(true)
        // Call the new Slug Endpoint
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants/data-by-slug/${restaurantSlug}`
        )
        
        const data = res.data.data || res.data
        setRestaurant(data)

        if (data && data.id) {
          localStorage.setItem("restaurant_id", data.id)
        }
        
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Restaurant not found")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [restaurantSlug])


  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
 
  // Restore cart on first render
  useEffect(() => {
    if (typeof window === "undefined") return

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (err) {
        console.error("Failed to parse saved cart", err)
        localStorage.removeItem("cart")
      }
    }
    setIsInitialized(true)
  }, [])

 useEffect(() => {
    if (!isInitialized) return 
    
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart, isInitialized])


  const allItems =
    restaurant?.categories?.flatMap((c) =>
      c.items.map((item) => ({
        ...item,
        price: item.basePrice, // use price for UI convenience
        image: item.image ?? undefined,
        category: c.name,
        variants: item.variants ?? [],
      }))
    ) ?? []

  const filteredItems =
    activeCategory === "All"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory)

  const categories = restaurant ? ["All", ...restaurant.categories.map((c) => c.name)] : ["All"]

  const addToCart = (item: any, selectedOptions: MenuOption[] = [], qty = 1) => {
    
    const optionIds = selectedOptions.map((o) => o.id)
    const optionsKey = optionIds.join("-")
    const cartId = optionsKey ? `${item.id}-${optionsKey}` : item.id

    const optionsPrice = selectedOptions.reduce((s, o) => s + (o.price || 0), 0)
    const itemPrice = (item.price ?? item.basePrice ?? 0) + optionsPrice

    setCart((prev) => {
      const existing = prev.find((c) => c.id === cartId)
      if (existing) {
        return prev.map((c) => (c.id === cartId ? { ...c, quantity: c.quantity + qty } : c))
      }
      return [
        ...prev,
        {
          restaurantId: restaurant?.id || "",
          id: cartId,
          menuItemId: item.id,
          selectedOptionIds: optionIds,
          name: item.name + (selectedOptions.length ? ` (${selectedOptions.map(o => o.name).join(", ")})` : ""),
          description: item.description,
          price: itemPrice,
          quantity: qty,
          image: item.image,
        },
      ]
    })
  }

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-background min-h-screen">
        <div className="flex flex-col items-center">
          <Spinner />
          <p className="mt-4 text-foreground">Loading restaurant ...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-background min-h-screen">
        <div className="flex flex-col items-center">
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center bg-background min-h-screen">
        <div className="flex flex-col items-center">
          <p className="mt-4 text-white">No restaurant data found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      <div className="md:overflow-y-auto pb-6">
        <div className="max-w-8xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 md:gap-0 md:min-h-[calc(100vh-80px)]">
            <div className="md:overflow-y-auto">
              <RestaurantHeader deliveryMode={deliveryMode} setDeliveryMode={setDeliveryMode} restaurant={restaurant} />

              <div className="px-4 mb-6 sticky top-16 z-30 py-3 md:py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-3xl">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} color="#DC5F00" />
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

              <CategoryNav categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

              <div className="md:px-4 space-y-4 pb-20">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
              </div>
            </div>

            <div className="hidden md:flex flex-col fixed top-0 right-0 w-[380px] h-screen bg-[#1c1a17] shadow-xl z-40 border-l border-gray-800">
              <ShoppingBasket items={cart} total={total} onRemoveItem={removeFromCart} onUpdateQuantity={updateQty} />
            </div>
          </div>
        </div>
      </div>

      {isMobile && cart.length > 0 && (
        <FloatingCartButton itemCount={cart.length} total={total} items={cart} onRemoveItem={removeFromCart} onUpdateQuantity={updateQty} />
      )}
    </div>
  )
}
