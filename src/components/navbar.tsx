"use client"

import { ShoppingCart, Search, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface NavbarProps {
  cartCount?: number
}

export function Navbar({ cartCount = 0 }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-foreground">
          FoodHub
        </Link>

        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden flex-1 mx-8 md:flex">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Mobile Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-foreground" />
          </button>

          {/* User Icon */}
          <button className="rounded-lg p-2 hover:bg-muted transition-colors" aria-label="User account">
            <User className="h-5 w-5 text-foreground" />
          </button>

          {/* Cart Icon */}
          <button className="relative rounded-lg p-2 hover:bg-muted transition-colors" aria-label="Shopping cart">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search - Visible when open */}
      {searchOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search restaurants..."
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      )}
    </nav>
  )
}
