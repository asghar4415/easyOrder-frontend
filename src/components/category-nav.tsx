"use client"

import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CategoryNavProps {
  categories: string[]
  activeCategory: string
  setActiveCategory: (category: string) => void
}

function CategoryNav({ categories, activeCategory, setActiveCategory }: CategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <div className="relative px-4 md:px-0 mb-8 sticky top-32 md:top-20 z-20 bg-background py-4 border-b border-border">
      <div className="flex items-center gap-2 relative">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 p-2 bg-gradient-to-r from-background to-transparent"
          >
            <ChevronLeft size={20} className="text-muted-foreground" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-2 overflow-x-auto no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-button font-medium text-sm whitespace-nowrap transition-all ${
                activeCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-foreground border border-border hover:border-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 p-2 bg-gradient-to-l from-background to-transparent"
          >
            <ChevronRight size={20} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}

export default CategoryNav
