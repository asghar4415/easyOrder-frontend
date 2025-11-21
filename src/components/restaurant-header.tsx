"use client"

import { MapPin, Star, Clock, Bike, UtensilsCrossed } from "lucide-react"

interface RestaurantHeaderProps {
  deliveryMode: "delivery" | "collection"
  setDeliveryMode: (mode: "delivery" | "collection") => void
}

function RestaurantHeader({ deliveryMode, setDeliveryMode }: RestaurantHeaderProps) {
  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="h-48 w-full overflow-hidden bg-muted md:h-64">
        <img src="/placeholder.svg?key=kakth" alt="India Gate Restaurant" className="h-full w-full object-cover" />
      </div>

      {/* Restaurant Info Overlay */}
      <div className="bg-gradient-to-t from-black/80 to-transparent absolute -translate-y-32 w-full h-32 pointer-events-none md:translate-y-0 md:bg-none md:relative md:from-transparent md:to-transparent" />

      {/* Restaurant Details */}
      <div className="px-4 md:px-0 py-6 md:py-8">
        <div className="flex flex-col gap-4">
          {/* Name and Rating */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">India Gate</h1>
              <p className="text-sm text-muted-foreground mt-2">Authentic Indian Cuisine</p>
            </div>
            <div className="flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1 rounded-lg font-semibold text-sm flex-shrink-0">
              <Star size={16} className="fill-current" />
              4.8
            </div>
          </div>

          {/* Delivery/Collection Toggle */}
          <div className="flex gap-3">
            <button
              onClick={() => setDeliveryMode("delivery")}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                deliveryMode === "delivery"
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
            >
              <Bike size={18} />
              <span>Delivery</span>
            </button>
            <button
              onClick={() => setDeliveryMode("collection")}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                deliveryMode === "collection"
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
            >
              <UtensilsCrossed size={18} />
              <span>Collection</span>
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-accent flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Delivery time</p>
                <p className="font-semibold text-foreground">20-30 mins</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bike size={18} className="text-accent flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Delivery fee</p>
                <p className="font-semibold text-foreground">From $2.00</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-accent flex-shrink-0" />
              <div>
                <p className="text-muted-foreground text-xs">Min order</p>
                <p className="font-semibold text-foreground">$15.00</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-2">Opening hours</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{deliveryMode === "delivery" ? "Delivery" : "Collection"} · 11:00 - 23:00</p>
              <p className="text-accent font-medium">Currently open</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { RestaurantHeader }
export default RestaurantHeader
