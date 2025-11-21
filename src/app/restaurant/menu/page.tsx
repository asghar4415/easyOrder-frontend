"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart } from "lucide-react"
import RestaurantHeader from "@/components/restaurant-header"
import MenuItemCard from "@/components/menu-item-card"
import ShoppingBasket from "@/components/shopping-basket"
import CategoryNav from "@/components/category-nav"
import FloatingCartButton from "@/components/floating-cart-button"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isVegan?: boolean
  isVegetarian?: boolean
  isGlutenFree?: boolean
}

interface CartItem extends MenuItem {
  quantity: number
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Garlic Naan",
    description: "Soft naan bread with fresh garlic",
    price: 3.99,
    image: "/garlic-naan.png",
    category: "Highlights",
    isVegetarian: true,
  },
  {
    id: "2",
    name: "Samosa Trio",
    description: "Crispy pastries with spiced potatoes and peas",
    price: 4.99,
    image: "/samosa-appetizer.jpg",
    category: "Starters",
    isVegetarian: true,
    isVegan: true,
  },
  {
    id: "3",
    name: "Butter Chicken",
    description: "Tender chicken in creamy tomato sauce",
    price: 12.99,
    image: "/butter-chicken-curry.png",
    category: "Mains",
  },
  {
    id: "4",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with aromatic spices",
    price: 9.99,
    image: "/paneer-tikka.png",
    category: "Starters",
    isVegetarian: true,
  },
  {
    id: "5",
    name: "Biryani Rice",
    description: "Fragrant basmati rice with vegetables",
    price: 8.99,
    image: "/biryani-rice-dish.jpg",
    category: "Mains",
    isVegetarian: true,
  },
  {
    id: "6",
    name: "Gulab Jamun",
    description: "Soft cheese balls in sugar syrup",
    price: 5.99,
    image: "/gulab-jamun-dessert.png",
    category: "Desserts",
    isVegetarian: true,
  },
]

export default function RestaurantMenu() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("Highlights")
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "collection">("delivery")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["Highlights", "Starters", "Mains", "Desserts"]

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-accent">Easy Order</div>
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition relative">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 md:gap-0 md:min-h-[calc(100vh-80px)]">
          {/* Main Content */}
          <div className="md:pr-6 md:border-r md:border-border md:overflow-y-auto">
            {/* Hero Section */}
            <RestaurantHeader deliveryMode={deliveryMode} setDeliveryMode={setDeliveryMode} />

            {/* Search Bar */}
            <div className="px-4 md:px-0 mb-6 sticky top-16 md:top-0 z-30 bg-background py-3 md:py-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            {/* Category Navigation */}
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            {/* Menu Items Grid */}
            <div className="px-4 md:px-0 pb-8 md:pb-0 grid grid-cols-1 gap-4">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  isInCart={cart.some((i) => i.id === item.id)}
                />
              ))}
            </div>
          </div>

          {/* Sticky Basket (Desktop Only) */}
          <div className="hidden md:block sticky top-16 h-fit">
            <ShoppingBasket
              items={cart}
              total={cartTotal}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateQuantity}
            />
          </div>
        </div>
      </div>

      {/* Floating Cart Button (Mobile Only) */}
      {isMobile && cart.length > 0 && (
        <FloatingCartButton
          itemCount={cart.length}
          total={cartTotal}
          items={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
        />
      )}
    </div>
  )
}
