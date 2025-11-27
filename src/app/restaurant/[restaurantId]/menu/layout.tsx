import type React from "react"
import type { Metadata } from "next"
import "@/app/restaurant/restaurant.css"

export const metadata: Metadata = {
  title: "Restaurant Menu",
  description: "Browse and order from our menu",
}

export default function RestaurantMenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}