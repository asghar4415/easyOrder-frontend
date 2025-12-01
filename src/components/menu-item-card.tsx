"use client"

import { useState, useMemo } from "react"
import { Plus, Leaf, Droplet, X, Minus } from "lucide-react"
import Image from "next/image"

interface MenuItemOption {
  id: string
  name: string
  price: number
}

interface MenuVariant {
  id: string
  name: string
  type?: string // Expecting 'MULTI_SELECT' for checkboxes
  isRequired?: boolean
  minOptions?: number
  maxOptions?: number
  options: MenuItemOption[]
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  category?: string
  isVegan?: boolean
  isVegetarian?: boolean
  isGlutenFree?: boolean
  variants?: MenuVariant[]
}

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, selectedOptions?: MenuItemOption[], quantity?: number) => void
  isInCart?: boolean
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [showOptions, setShowOptions] = useState(false)
  
  // Store selections as arrays: { variantId: [Option1, Option2] }
  const [selectedVariants, setSelectedVariants] = useState<Record<string, MenuItemOption[]>>({})
  const [quantity, setQuantity] = useState(1)

  const handleAddToCartClick = () => {
    // If item has variants -> open modal to choose
    if (item.variants && item.variants.length > 0) {
      setShowOptions(true)
      return
    }
    // No variants -> add directly
    onAddToCart(item, [], 1)
  }

  const handleVariantSelect = (variant: MenuVariant, option: MenuItemOption) => {
    const isMultiSelect = variant.type === "MULTI_SELECT"

    setSelectedVariants((prev) => {
      const currentSelections = prev[variant.id] || []

      if (isMultiSelect) {
        // --- Multi Select Logic (Checkbox) ---
        const exists = currentSelections.find((o) => o.id === option.id)

        if (exists) {
          // Remove if already selected
          return {
            ...prev,
            [variant.id]: currentSelections.filter((o) => o.id !== option.id),
          }
        } else {
          // Add to selection
          return {
            ...prev,
            [variant.id]: [...currentSelections, option],
          }
        }
      } else {
        // --- Single Select Logic (Radio) ---
        // Replace the entire array with just this one option
        return {
          ...prev,
          [variant.id]: [option],
        }
      }
    })
  }

  const handleAddFromModal = () => {
    // Flatten all arrays into one list of options to send to cart
    const allSelectedOptions = Object.values(selectedVariants).flat()

    onAddToCart(item, allSelectedOptions, quantity)

    // Reset and close
    setShowOptions(false)
    setSelectedVariants({})
    setQuantity(1)
  }

  // Calculate total price: Base + Sum of all selected options
  const variantsTotal = useMemo(
    () => Object.values(selectedVariants).flat().reduce((s, o) => s + (o.price || 0), 0),
    [selectedVariants]
  )

  const totalPrice = (item.price + variantsTotal) * quantity

  // Validation: Check if all REQUIRED variants have at least one selection
  const isRequiredSatisfied = !item.variants?.some((v) => {
    const selections = selectedVariants[v.id] || []
    return v.isRequired && selections.length === 0
  })

  return (
    <>
      {/* --- Card UI --- */}
      <div className="bg-card rounded-lg p-4 pl-6 pr-6 hover:border-accent transition-colors flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm md:text-xl pb-2">{item.name}</h3>
          <p className="text-lg font-bold text-accent">${item.price.toFixed(2)}</p>
          {item.description && <p className="text-md text-foreground mb-2 line-clamp-2">{item.description}</p>}

          <div className="flex gap-2 mt-3 mb-3 flex-wrap">
            {item.isVegan && (<span className="inline-flex items-center gap-1 text-xs font-medium bg-[#024C23] px-2 py-1 rounded-lg"><Droplet size={12} />Vegan</span>)}
            {item.isVegetarian && !item.isVegan && (<span className="inline-flex items-center gap-1 text-xs font-medium bg-[#024C23] px-2 py-1 rounded-lg"><Leaf size={12} />Vegetarian</span>)}
            {item.isGlutenFree && (<span className="text-xs font-medium text-amber-600 bg-amber-950/30 px-2 py-1 rounded">GF</span>)}
          </div>
        </div>

        {item.image ? (
          <div className="h-24 w-24 flex-shrink-0 rounded-lg relative ">
            <Image src={item.image} alt={item.name} width={96} height={96} className="object-cover h-full w-full rounded-lg" />
            <button onClick={handleAddToCartClick} aria-label={`Add ${item.name}`} className="absolute top-2 right-2 bg-[#2b2a28]! border border-white/20 menuitem-add p-2 !rounded-full shadow">
              <Plus size={16} color="#DC5F00" />
            </button>
          </div>
        ) : (
          <button onClick={handleAddToCartClick} aria-label={`Add ${item.name}`} className="bg-[#2b2a28]! text-accent-foreground !rounded-full p-2 menuitem-add hover:opacity-90 shadow-lg self-start">
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* --- Modal UI --- */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2">
          <div className="bg-[#2b2a28] rounded-lg max-w-lg w-full relative flex flex-col max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="p-4 border-b border-border relative">
              <button
                onClick={() => setShowOptions(false)}
                className="absolute top-3 right-3 text-foreground p-1 rounded-full! hover:bg-card z-50 bg-[#2b2a28]! border border-white/20"
              >
                <X size={20} color="#DC5F00" />
              </button>

              {item.image && (
                <div className="w-full h-40 mb-3 relative rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={384}
                    height={160}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              )}

              <h3 className="font-bold text-2xl">{item.name}</h3>
              <p className="text-accent font-bold mb-1">${item.price.toFixed(2)}</p>
              {item.description && (
                <p className="text-sm text-foreground">{item.description}</p>
              )}
            </div>

            {/* Variants List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {item.variants?.map((variant) => {
                const isMultiSelect = variant.type === "MULTI_SELECT"
                
                return (
                  <div key={variant.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <h4 className="font-semibold text-lg">{variant.name}</h4>
                        {isMultiSelect && (
                            <span className="text-xs text-muted-foreground">Select multiple</span>
                        )}
                      </div>
                      
                      {variant.isRequired && (
                        <span className="text-sm text-red-400">Required</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {variant.options.map((opt) => {
                         // Check if this option is inside the array for this variant
                         const isSelected = selectedVariants[variant.id]?.some(o => o.id === opt.id)

                         return (
                          <label
                            key={opt.id}
                            className={`flex items-center justify-between cursor-pointer px-4 py-2 rounded-lg transition-colors border border-transparent
                              ${isSelected
                                  ? "bg-card text-accent-foreground border-accent/20"
                                  : "bg-card text-foreground"
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type={isMultiSelect ? "checkbox" : "radio"}
                                name={`variant-${variant.id}`} // Group radio buttons by variant ID
                                checked={isSelected || false}
                                onChange={() => handleVariantSelect(variant, opt)}
                                className="w-4 h-4 accent-[#DC5F00] cursor-pointer"
                              />
                              <span>{opt.name}</span>
                            </div>

                            <span className="font-semibold">
                              ${opt.price.toFixed(2)}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer / Add Button */}
            <div className="p-4 border-t border-border bg-[#2b2a28] shadow-[0_-8px_20px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-1 bg-[#2b2a28]! rounded-l-full"
                >
                  <Minus color="#DC5F00"/>
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-1 bg-[#2b2a28]! rounded-r-full"
                >
                  <Plus color="#DC5F00"/>
                </button>
              </div>

              <button
                onClick={handleAddFromModal}
                disabled={!isRequiredSatisfied}
                className="px-5 py-2 !bg-[#DC5F00] text-accent-foreground rounded-full font-bold flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add <span>${totalPrice.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}