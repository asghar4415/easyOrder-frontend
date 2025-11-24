"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import RestaurantHeader from "@/components/restaurant-header"
import MenuItemCard from "@/components/menu-item-card"
import ShoppingBasket from "@/components/shopping-basket"
import CategoryNav from "@/components/category-nav"
import FloatingCartButton from "@/components/floating-cart-button"
import { Navbar } from "@/components/navbar"

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
  options?: MenuItemOption[] 

}

interface MenuItemOption {
  id: string
  name: string
  price: number
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
    image: "/images/restaurant/menu1.jpeg",
    category: "Mains",
    options: [
      { id: "small", name: "Small", price: 0 },
      { id: "medium", name: "Medium", price: 2 },
      { id: "large", name: "Large", price: 4 },
    ],
  },
  {
    id: "4",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with aromatic spices",
    price: 9.99,
    image: "/images/restaurant/menu2.jpeg",
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

const addToCart = (item: MenuItem, selectedOption?: MenuItemOption, quantity: number = 1) => {
  const itemToAdd = {
    ...item,
    id: selectedOption ? item.id + "-" + selectedOption.id : item.id,
    price: item.price + (selectedOption ? selectedOption.price : 0),
    quantity,
    selectedOption: selectedOption ? selectedOption.name : undefined,
  }

  setCart((prev) => {
    const existing = prev.find((i) => i.id === itemToAdd.id)
    if (existing) {
      return prev.map((i) =>
        i.id === itemToAdd.id ? { ...i, quantity: i.quantity + quantity } : i
      )
    }
    return [...prev, itemToAdd]
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
      <Navbar />
      


 <div className=" md:overflow-y-auto pb-6">
    <div className="max-w-8xl mx-auto px-4 md:px-8">

   
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 md:gap-0 md:min-h-[calc(100vh-80px)]">
       
          <div className=" md:overflow-y-auto">
            <RestaurantHeader deliveryMode={deliveryMode} setDeliveryMode={setDeliveryMode} />
 
           <div className="px-4 mb-6 sticky top-16 z-30 py-3 md:py-4">
  <div className="flex justify-center">
    <div className="relative w-full max-w-3xl"> {/* max width for larger screens */}
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
        className="w-full pl-10 pr-2 py-2 border border-border text-foreground placeholder-muted-foreground focus:outline-none search-button-1"
      />
    </div>
  </div>
</div>


            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

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


<div className="hidden md:flex flex-col fixed top-0 right-0 w-[380px] h-screen bg-[#373A40] shadow-xl z-40 overflow-y-auto">
  <ShoppingBasket
    items={cart}
    total={cartTotal}
    onRemoveItem={removeFromCart}
    onUpdateQuantity={updateQuantity}
  />
</div>

        </div>
        </div>
      </div> 

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
