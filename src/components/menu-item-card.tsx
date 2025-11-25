"use client"

import { useState } from "react"
import { Plus, Leaf, Droplet, X } from "lucide-react"
import Image from "next/image"


interface MenuItemOption {
  id: string
  name: string
  price: number
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category: string
  isVegan?: boolean
  isVegetarian?: boolean
  isGlutenFree?: boolean
  options?: MenuItemOption[]  // optional variants
}
interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, selectedOption?: MenuItemOption, quantity?: number) => void
  isInCart?: boolean
}

function MenuItemCard({ item, onAddToCart, isInCart }: MenuItemCardProps) {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedOption, setSelectedOption] = useState<MenuItemOption | null>(null)
  const [quantity, setQuantity] = useState(1)


const handleAddToCart = () => {
    if (item.options && item.options.length > 0) {
      setShowOptions(true) // open options modal/card
    } else {
      onAddToCart(item, undefined, 1) // no options, add directly
    }
  }

  const handleOptionSelect = (option: MenuItemOption) => {
    setSelectedOption(option)
  }

 const handleOptionAdd = () => {
  if (selectedOption) {
    onAddToCart(item, selectedOption, quantity) // send quantity
    setShowOptions(false)
    setSelectedOption(null)
    setQuantity(1)
  }
}


const totalPrice = (item.price + (selectedOption ? selectedOption.price : 0)) * quantity


  return (
    <>
      <div className="bg-card rounded-lg p-4 pl-6 pr-6 hover:border-accent transition-colors flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm md:text-xl pb-2">{item.name}</h3>
           <p className="text-lg font-bold text-accent">
            ${item.price.toFixed(2)}
          </p>
          <p className="text-md text-foreground mb-2 line-clamp-2">{item.description}</p>

          {/* Dietary Tags */}
          <div className="flex gap-2 mt-3 mb-3 flex-wrap">
            {item.isVegan && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#024C23] px-2 py-1 rounded-lg border-green-900/50">
                <Droplet size={12} />
                Vegan
              </span>
            )}
            {item.isVegetarian && !item.isVegan && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#024C23] px-2 py-1 rounded-lg border-green-900/50">
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

        </div>

        {item.image && (
          <div className="h-30 w-30 shrink-0 rounded-lg  relative">
            <Image
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover overflow-hidden rounded-lg"
              width={96}
              height={96}
            />
            <button
              onClick={handleAddToCart}
              className="absolute menutitem-add !bg-[#2b2a28] border border-[#e4e2e2] hover:opacity-90 shadow-lg"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus size={16} color="#DC5F00" /> {/* orange plus icon */}
            </button>
          </div>
        )}

        {/* If no image */}
        {!item.image && (
          <button
            onClick={handleAddToCart}
            className="bg-accent text-accent-foreground rounded-full p-2 hover:opacity-90 shadow-lg self-start"
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus size={16} />
          </button>
        )}

      </div>

      
      {showOptions && item.options && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2">
          <div className="bg-[#2b2a28] rounded-lg p-6 max-w-lg w-full relative">

            {/* Close Button */}
            {item.image && (
              <button
                onClick={() => setShowOptions(false)}
                className="absolute top-4 right-4 text-foreground p-2 border !bg-[#2b2a28] !rounded-full hover:bg-gray-700 z-10"
              >
                <X size={20} />
              </button>
            )}

            {/* Item Image */}
            {item.image && (
              <div className="w-full h-48 mb-4 relative rounded overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                  width={384}
                  height={192}
                />
              </div>
            )}

            {/* Item Name, Price, Description */}
            <h3 className="font-bold text-2xl">{item.name}</h3>
            <p className="text-accent font-bold mb-2">
              ${item.price.toFixed(2)}
            </p>
            <p className="text-md text-foreground mb-4">{item.description}</p>

            <hr className="border-border mb-4" />

            {/* Variant Name */}
            <h4 className="font-semibold text-xl mb-2">Options</h4>

            {/* Options */}
            <div className="flex flex-col gap-2 mb-4">
              {item.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleOptionSelect(opt)}
                  className={`flex justify-between items-center px-4 py-2 rounded-lg transition-colors ${
                    selectedOption?.id === opt.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-card text-foreground"
                  }`}
                >
                  <span>{opt.name}</span>
                  <span className="font-semibold">${opt.price.toFixed(2)}</span>
                </button>
              ))}
            </div>

            {/* Quantity and Add */}
            <div className="w-full flex justify-between items-center p-4 bg-[#2b2a28] shadow-[0_-5px_10px_rgba(0,0,0,0.3)] rounded-b-lg">
        {/* Quantity selector */}
   <div className="flex items-center gap-2 border bg-[#2b2a28] rounded-full px-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-2 py-1 bg-card rounded-l-full"
          >
            -
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="px-2 py-1 bg-card rounded-r-full"
          >
            +
          </button>
        </div>

        {/* Add button */}
        <button
          onClick={handleOptionAdd}
          className="px-4 py-2 md:w-60 !bg-[#DC5F00] text-accent-foreground !rounded-full font-bold flex justify-between"
        >
          Add
          <span>${totalPrice.toFixed(2)}</span>
        </button>
      </div>
          </div>
        </div>
      )}
    </>
  )
}

export { MenuItemCard }
export default MenuItemCard
