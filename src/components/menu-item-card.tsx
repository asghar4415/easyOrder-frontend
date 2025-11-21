"use client"

import { Plus, Leaf, Droplet } from "lucide-react"

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

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  isInCart?: boolean
}

function MenuItemCard({ item, onAddToCart, isInCart }: MenuItemCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-colors">
      <div className="flex gap-4">
        {/* Image */}
        <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-muted overflow-hidden relative">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
          {/* Add to Cart Button - Overlay */}
          <button
            onClick={() => onAddToCart(item)}
            className="absolute bottom-2 right-2 bg-accent text-accent-foreground rounded-full p-2 hover:opacity-90 transition-opacity shadow-lg"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm md:text-base">{item.name}</h3>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

          {/* Dietary Tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {item.isVegan && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-950/30 px-2 py-1 rounded border border-green-900/50">
                <Droplet size={12} />
                Vegan
              </span>
            )}
            {item.isVegetarian && !item.isVegan && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-950/30 px-2 py-1 rounded border border-green-900/50">
                <Leaf size={12} />
                Vegetarian
              </span>
            )}
            {item.isGlutenFree && (
              <span className="text-xs font-medium text-amber-600 bg-amber-950/30 px-2 py-1 rounded border border-amber-900/50">
                GF
              </span>
            )}
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-accent">${item.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export { MenuItemCard }
export default MenuItemCard
